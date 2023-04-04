const express = require('express');
const Razorpay = require('razorpay');
const instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY,
  key_secret: process.env.RAZOR_PAY_SECRET,
});
const router = express.Router();
const Shop = require('../../../models/Shop');
const Order = require('../../../models/Order');
const httpErrors = require('http-errors');

router.post('/user/online/getOrderId', async (req, res, next) => {
  try {
    const new_order = req.body.orderItem;

    const shop = await Shop.findOne({ _id: req.query.shopId });
    if (!shop.isOpen) {
      throw httpErrors.BadRequest('Shop is currently Closed');
    }

    if (!shop.allowCheckout) {
      throw createError.BadRequest(
        'Due To High Traffic Shop is Currently Unavailable'
      );
    }

    var options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: 'ApnaMZP_payment_recipt',
      payment_capture: 1,
      notes: {
        phoneNo: req.body.userPhoneNo,
      },
    };

    try {
      instance.orders.create(options, async function (err, createdOrder) {
        if (err) throw err;

        new_order.paymentId = createdOrder.id;
        new_order.tempOrder = true;

        if (new_order.adminShopService) {
          new_order.expectedDeliveryTime = '15min';
        }

        const order = await Order.create(new_order);

        console.log('order created', order._id);
        setTimeout(async () => {
          const checkOrder = await Order.findOne({ _id: order._id.toString() });
          if (checkOrder == null) return;

          if (checkOrder.paymentId == createdOrder.id) {
            console.log('order deleted', order._id);
            await Order.findOneAndDelete({ _id: order._id.toString() });
          }
        }, 1000 * 60 * 2);

        res.json({
          paymentId: createdOrder.id,
        });
      });
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
