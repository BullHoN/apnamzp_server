const express = require('express');
const Order = require('../../../models/Order')
const User = require('../../../models/User')
const sendNotification = require('../../../util/sendNotification');
const Razorpay = require('razorpay')
const instance = new Razorpay(
    { key_id: process.env.RAZOR_PAY_KEY, key_secret: process.env.RAZOR_PAY_SECRET }
)
const router = express.Router();


router.get('/partner/reject_order',async (req,res,next)=>{
    // change order statues
    const order_id = req.query.order_id;
    const user_id = req.query.user_id;
    const cancel_reason = req.query.cancel_reason;

    try{
        const order = await Order.findOne({_id: order_id});

        if(order.orderStatus >= 1){
            res.send({success: false});
            return
        }

        order.cancelled = true;
        order.orderStatus = 7;
        order.cancelReason = cancel_reason;
        order.save();
        
        instance.payments.refund(order.paymentId,{}).then((err,data)=>{
        })

        const user = await User.findOne({phoneNo: user_id})

        sendNotification(user.fcmId,{
            "data": "sdgsdg",
            "type": "order_status_rejected",
            "title": "Order Cancelled By Shop",
            "desc": cancel_reason ,
            "orderId": order_id          
        })

        res.send({success: true});
    }
    catch(err){
        next(err)
    }

})



module.exports = router;