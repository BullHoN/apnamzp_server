const express = require('express');
const router = express.Router();
const Order = require('../../../models/Order');
const User = require('../../../models/User');
const sendNotification = require('../../../util/sendNotification')

router.post('/partner/order/updateStatus',async (req,res)=>{
    const {orderId, orderStatus} = req.query; 

    console.log(orderId,orderStatus);

    const order = await Order.findOne({_id: orderId});
    order.orderStatus = Number.parseInt(orderStatus);
    order.save();

    if(order.orderStatus == 6){
        // update the cash in the hand of the deliveyr sathi
        const deliverySathi = await User.findOne({phoneNo: order.assignedDeliveryBoy})
        if(order.isPaid){
            let amountPaidToResturant = order.billingDetails.itemTotal + order.billingDetails.totalTaxesAndPackingCharge - order.billingDetails.totalDiscount
            if(order.offerCode != null && order.offerCode != '' && !order.offerCode.includes("APNAMZP")){
                amountPaidToResturant -= order.billingDetails.offerDiscountedAmount
            }

            deliverySathi.cashInHand -= amountPaidToResturant
        }
        else {
            deliverySathi.cashInHand += order.billingDetails.deliveryCharge + order.billingDetails.itemsOnTheWayTotalCost
        }

        deliverySathi.currOrders -= 1;

        await deliverySathi.save();
    }

    const user = await User.findOne({phoneNo: order.userId});
    sendNotification(user.fcmId,{
        "data": "assdgsdg",
        "type": "order_status_change",
        "title": "kuch to huaa hai",
        "desc": "kuch ho to rha hai",
        "orderId": orderId
    })

    res.json({success: true});
})



module.exports = router;