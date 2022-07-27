const express = require('express')
const Order = require('../../../models/Order')
const User = require('../../../models/User')
const client = require('../../../util/init_redis')
const sendNotification = require('../../../util/sendNotification')
const router = express.Router()

router.post('/apna_mzp/admin/cancelOrder', async (req,res,next)=>{
    const { orderId, cancelReason } = req.query; 

    try{
        const order = await Order.findOne({_id: orderId});
        const user = await User.findOne({phoneNo: order.userId})

        order.cancelled = true
        order.cancelReason = cancelReason
        await order.save()

        let pendingOrders = await client.get("pendingOrders")
        pendingOrders = JSON.parse(pendingOrders)

        pendingOrders = pendingOrders.filter((od)=>{
            return (od._id != orderId)
        })

        await client.set("pendingOrders",JSON.stringify(pendingOrders))

        sendNotification(user.fcmId,{
            "data": "sdgsdg",
            "type": "order_status_rejected",
            "title": "na bol diya bhai",
            "desc": "mna kar diya usne abb hm kya kar sakte hai" ,
            "orderId": orderId          
        })

        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router