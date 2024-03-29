const express = require('express');
const Order = require('../../../models/Order');
const sendNotification = require('../../../util/sendNotification');
const DeliverySathi = require('../../../models/DeliverySathi');
const ShopData = require('../../../models/Shop');
const client = require('../../../util/init_redis');
const router = express.Router();

router.post('/apna_mzp/admin/assign_delivery_sathi', async (req, res, next) => {
  const { orderId, deliverySathiNo } = req.query;

  try {
    const order = await Order.findOne({ _id: orderId });

    if (order.assignedDeliveryBoy) {
      const previous = await DeliverySathi.findOneAndUpdate(
        { phoneNo: order.assignedDeliveryBoy },
        { $inc: { currOrders: -1 } }
      );
    }

    order.assignedDeliveryBoy = deliverySathiNo;
    await order.save();

    const shopData = await ShopData.findOne({ _id: order.shopID });
    const deliverySathi = await DeliverySathi.findOne({
      phoneNo: deliverySathiNo,
    });

    let pendingOrders = await client.get('pendingOrders');
    pendingOrders = JSON.parse(pendingOrders);

    pendingOrders = pendingOrders.filter((od) => {
      return od._id != orderId;
    });

    await client.set('pendingOrders', JSON.stringify(pendingOrders));

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
        specialInstructions: order.specialInstructions,
        orderItems: order.orderItems,
        totalAmountToGiveShop: getTotalAmountToGiveShop(
          order.billingDetails,
          order.offerCode
        ),
        _id: orderId,
      }),
      type: 'order',
      title: 'nya order aa gya bhai',
      desc: 'jake de aa order bhai',
    });

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

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

module.exports = router;
