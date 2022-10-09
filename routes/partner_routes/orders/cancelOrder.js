const express = require('express')
const Order = require('../../../models/Order')
const User = require('../../../models/User')
const DeliverySathi = require('../../../models/')
const sendNotification = require('../../../util/sendNotification')
const router = express.Router()

router.post('/apna_mzp/admin/cancelOrder', async (req,res,next)=>{
    const { orderId, cancelReason } = req.query; 

    try{
        const order = await Order.findOne({_id: orderId});
        const user = await User.findOne({phoneNo: order.userId})

        order.orderStatus = 7
        order.cancelled = true
        order.cancelReason = cancelReason
        await order.save()

        if(order.orderAcceptedByDeliverySathi){

        }

        if(user){
            sendNotification(user.fcmId,{
                "data": "sdgsdg",
                "type": "order_status_rejected",
                "title": "Order Cancelled",
                "desc": cancelReason,
                "orderId": orderId          
            })
        }

        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router