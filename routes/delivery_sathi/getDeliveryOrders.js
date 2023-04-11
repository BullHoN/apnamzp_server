const express = require('express');
const Order = require('../../models/Order');
const Shop = require('../../models/Shop');
const User = require('../../models/User');
const router = express.Router();

router.get('/sathi/orders/:delivery_sathi', async (req, res, next) => {
  const delivery_sathi = req.params.delivery_sathi;
  const order_status = req.query.order_status;

  try {
    let orders;
    if (order_status == 5) {
      orders = await Order.find({
        assignedDeliveryBoy: delivery_sathi,
        orderStatus: Number.parseInt(order_status),
        orderAcceptedByDeliverySathi: true,
        tempOrder: false,
      });
    } else {
      orders = await Order.find({
        assignedDeliveryBoy: delivery_sathi,
        orderStatus: {
          $lte: Number.parseInt(order_status),
        },
        orderAcceptedByDeliverySathi: true,
        tempOrder: false,
      });
    }

    let mappedOrders = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const shop = await Shop.findOne({ _id: order.shopID });
      const customer = await User.findOne({ phoneNo: order.userId });

      let customerName = customer ? customer.name : 'No-Name';

      mappedOrders.push({
        _id: order._id.toString(),
        orderItems: order.orderItems,
        shopInfo: {
          name: shop.name,
          latitude: shop.addressData.latitude,
          longitude: shop.addressData.longitude,
          phoneNo: shop.phoneNO,
          rawAddress: shop.addressData.mainAddress,
        },
        userInfo: {
          name: customerName,
          latitude: order.deliveryAddress.latitude,
          longitude: order.deliveryAddress.longitude,
          phoneNo: order.userId,
          rawAddress: order.deliveryAddress.rawAddress,
          landmark: order.deliveryAddress.landmark,
          houseNo: order.deliveryAddress.houseNo,
        },
        itemsOnTheWay: order.itemsOnTheWay,
        totalAmountToTake: order.billingDetails.totalPay,
        orderStatus: order.orderStatus,
        isPaid: order.isPaid,
        totalAmountToGive: getTotalAmountToGiveShop(
          order.billingDetails,
          order.offerCode
        ),
        itemsOnTheWayCancelled: order.itemsOnTheWayCancelled,
        itemsOnTheWayActualCost: order.billingDetails.itemsOnTheWayActualCost,
        deliverySathiIncome: order.deliverySathiIncome,
      });
    }

    res.json(mappedOrders);
  } catch (error) {
    next(error);
  }
});

function getTotalAmountToGiveShop(billingDetails, offerCode) {
  let totalReceivingAmount =
    billingDetails.itemTotal + billingDetails.totalTaxesAndPackingCharge;

  if (offerCode != null && offerCode != '' && !offerCode.includes('APNA')) {
    totalReceivingAmount -= billingDetails.offerDiscountedAmount;
  }

  if (billingDetails.itemTotal >= billingDetails.freeDeliveryPrice) {
    totalReceivingAmount -= billingDetails.deliveryCharge;
  }

  return totalReceivingAmount;
}

// function mapOrders(orders){
//     return new Promise((resolve,reject)=>{

//     })
// }

module.exports = router;
