const express = require('express');
const Order = require('../../models/Order')
const sendNotification = require('../../util/sendNotification')
const User = require('../../models/User')
const router = express.Router();

router.post('/sathi/cancelItemsOnTheWay/:orderId',async (req,res,next)=>{
    const orderId = req.params.orderId;

    try{
        const order = await Order.findOne({_id: orderId});
        order.itemsOnTheWayCancelled = true;
        order.billingDetails.totalPay = order.billingDetails.totalPay - order.billingDetails.itemsOnTheWayTotalCost - order.billingDetails.itemsOnTheWayActualCost;
        order.billingDetails.itemsOnTheWayTotalCost = 0;
        order.billingDetails.itemsOnTheWayActualCost = 0;

        await order.save();

        // send notification to the user
        const user = await User.findOne({phoneNo: order.userId});
        sendNotification(user.fcmId,{
            "data": "assdgsdg",
            "type": "order_status_change",
            "title": "Items On The Way Rejected",
            "desc": "Jayda Challak Mat Bano sir",
            "orderId": orderId
        })

        res.json({
            success: true
        })
    }
    catch(e){
        next(e)
    }


})

module.exports = router;