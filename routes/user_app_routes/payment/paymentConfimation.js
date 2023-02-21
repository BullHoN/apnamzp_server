const express = require('express');
const print = require('../../../util/printFullObject');
const Order = require('../../../models/Order');
const router = express.Router();
const resturantNotRespondedAlert = require('../../../alerts/resturant_not_responded.alert');
const sendNotification = require('../../../util/sendNotification');
const Shop = require('../../../models/Shop');
const ShopPartner = require('../../../models/ShopPartner');
const axios = require('axios');

router.post('/user/payment/verification', async (req, res, next) => {
  const SECRET = 'Apna%$aB&&42';

  const crypto = require('crypto');

  const shasum = crypto.createHmac('sha256', SECRET);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  //   console.log(digest, req.headers['x-razorpay-signature']);

  res.status(200).json({ success: 'ok' });

  if (digest === req.headers['x-razorpay-signature']) {
    const orderPaymentId = req.body.payload.payment.entity.order_id;
    const paymentId = req.body.payload.payment.entity.id;

    if (orderPaymentId != null) {
      const order = await Order.findOne({ paymentId: orderPaymentId });
      if (order != null) {
        order.paymentId = paymentId;
        await order.save();

        const shopData = await Shop.findOne({ _id: order.shopID });
        const shopUser = await ShopPartner.findOne({
          phoneNo: shopData.phoneNO,
        });

        if (order.adminShopService) {
          const deliverySathiAssignInterval = setInterval(async () => {
            try {
              const assginedRes = await axios.post(
                `${process.env.HTTP_HOST}://${process.env.HOST_NAME}/partner/assignDeliveryBoy?orderId=${order._id}&latitude=${shopData.addressData.latitude}&longitude=${shopData.addressData.longitude}`,
                {}
              );
              clearInterval(deliverySathiAssignInterval);
              if (assginedRes.success) {
                clearInterval(deliverySathiAssignInterval);
              }
            } catch (err) {
              console.log(err);
            }
          }, 1000);
        } else {
          sendNotification(shopUser.fcmId, {
            orderItems: JSON.stringify(order.orderItems),
            _id: order._id.toString(),
            userId: order.userId,
            specialInstructions: order.specialInstructions,
            type: 'new_order',
            totalPay:
              getTotalReceivingAmount(order.billingDetails, order.offerCode) +
              '',
            isDeliveryService:
              (order.billingDetails.isDeliveryService == true) + '',
          });
        }

        resturantNotRespondedAlert(order._id, order.adminShopService);
      }
    }
  } else {
    console.log('Invalid Payment Verification');
    // pass it
  }
});

function getTotalReceivingAmount(billingDetails, offerCode) {
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
