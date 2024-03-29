const geolib = require('geolib');
const Order = require('../../models/Order');
const DeliverySathi = require('../../models/DeliverySathi');
const sendNotification = require('../../util/sendNotification');
const sendNotificationByTopic = require('../../util/sendNotificationOnTopic');
const User = require('../../models/User');
const createError = require('http-errors');
const Shop = require('../../models/Shop');
const client = require('../../util/init_redis');

// {latitude: "25.133699", longitude: "82.564430"}
// 25.13649844681555, 82.56680760096513
// 28.84196614894497, 77.57740291535762

module.exports = {
  assignDeliveryBoy: async (req, res, next) => {
    const { orderId, latitude, longitude, alreadyAssignedSathi } = req.query;

    if (
      orderId == undefined ||
      latitude == undefined ||
      longitude == undefined
    ) {
      throw createError.BadRequest('Bad Request');
    }

    try {
      let order = await Order.findById({ _id: orderId });
      if (!order) {
        res.json({
          success: true,
        });

        return;
      }

      if (order.orderAcceptedByDeliverySathi || order.orderStatus >= 6) {
        res.json({
          success: true,
        });

        return;
      }

      const shopData = await Shop.findOne({
        shopType: order.shopCategory,
        _id: order.shopID,
      });
      const user = await User.findOne({ phoneNo: order.userId });

      let assignedDeliveryBoy = { dist: Number.MAX_SAFE_INTEGER };
      let tries = 0;
      let assignDeliveryBoyInterval = setInterval(async () => {
        order = await Order.findById({ _id: orderId });

        if (!order) {
          clearInterval(assignDeliveryBoyInterval);
          return;
        }

        if (order.orderAcceptedByDeliverySathi || order.orderStatus >= 6) {
          clearInterval(assignDeliveryBoyInterval);
          return;
        }

        let deliverySathis = await client.get('deliverySathis');
        if (deliverySathis == null) deliverySathis = '{}';

        deliverySathis = JSON.parse(deliverySathis);

        let keys = Object.keys(deliverySathis);

        console.log(keys.length, tries);

        if (tries > 1) {
          //TODO: send notification to admin
          let pendingOrders = await client.get('pendingOrders');
          if (pendingOrders == null) pendingOrders = [];
          else pendingOrders = JSON.parse(pendingOrders);
          await client.set(
            'pendingOrders',
            JSON.stringify([...pendingOrders, order])
          );

          console.log('send order to admin');
          // send notification to user on the topuc
          sendNotificationByTopic('pending_orders', {
            type: 'pending',
          });

          clearInterval(assignDeliveryBoyInterval);

          return;
        }

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const curr = deliverySathis[key];
          const dist = getDistance(
            {
              latitude: Number.parseFloat(curr['latitude']),
              longitude: Number.parseFloat(curr['longitude']),
            },
            {
              latitude: Number.parseFloat(latitude),
              longitude: Number.parseFloat(longitude),
            }
          );

          const deliverySathi = await DeliverySathi.findOne({ phoneNo: key });

          console.log(alreadyAssignedSathi, key, alreadyAssignedSathi != key);

          if (
            deliverySathi.currOrders == 0 &&
            dist < assignedDeliveryBoy.dist &&
            alreadyAssignedSathi != deliverySathi.phoneNo
          ) {
            assignedDeliveryBoy = curr;
            assignedDeliveryBoy.dist = dist;
          }

          // TODO: remove this
          // assignedDeliveryBoy = curr;
          // assignedDeliveryBoy.dist = dist;
        }

        if (assignedDeliveryBoy.phoneNo != null) {
          clearInterval(assignDeliveryBoyInterval);

          order.assignedDeliveryBoy = assignedDeliveryBoy.phoneNo;
          await order.save();

          const deliverySathi = await DeliverySathi.findOne({
            phoneNo: assignedDeliveryBoy.phoneNo,
          });
          deliverySathi.currOrders += 1;
          await deliverySathi.save();

          sendNotification(deliverySathi.fcmId, {
            data: JSON.stringify({
              shopInfo: {
                name: shopData.name,
                phoneNo: shopData.phoneNO,
                rawAddress: shopData.addressData.mainAddress,
                latitude: shopData.addressData.latitude,
                longitude: shopData.addressData.longitude,
              },
              adminShopService: order.adminShopService,
              orderItems: order.orderItems,
              totalAmountToGiveShop: getTotalAmountToGiveShop(
                order.billingDetails,
                order.offerCode
              ),
              specialInstructions: order.specialInstructions,
              _id: order._id,
            }),
            type: 'order',
            title: 'New Order Received',
            desc: 'Hurry Up New Order Has Been Received',
          });
        }

        console.log('delivey sathi seen kya hai', assignedDeliveryBoy);

        tries++;
      }, 1 * 1000 * 60);

      res.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },
};

function getTotalAmountToGiveShop(billingDetails, offerCode) {
  let totalReceivingAmount =
    billingDetails.itemTotal +
    billingDetails.totalTaxesAndPackingCharge +
    billingDetails.totalTaxesAndPackingCharge;
  if (offerCode != null && offerCode != '' && !offerCode.includes('APNA')) {
    totalReceivingAmount -= billingDetails.offerDiscountedAmount;
  }

  if (billingDetails.itemTotal >= billingDetails.freeDeliveryPrice) {
    totalReceivingAmount -= billingDetails.deliveryCharge;
  }

  return totalReceivingAmount;
}

function getDistance(from, to) {
  return geolib.getDistance(from, to);
}
