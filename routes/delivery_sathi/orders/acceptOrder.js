const express = require('express')
const Order = require('../../../models/Order')
const sendNotification = require('../../../util/sendNotification')
const User = require('../../../models/User')
const router = express.Router()

router.post('/sathi/acceptOrder',async (req,res,next)=>{
    const { orderId, deliverySathiNo } = req.query
    try{
        const order = await Order.findOne({_id: orderId});
        order.orderAcceptedByDeliverySathi = true
        await order.save()

        const user = await User.findOne({phoneNo: order.userId})

        sendNotification(user.fcmId,{
            "data": "assdgsdg",
            "type": "order_status_change",
            "title": "Delivery Sathi Assigned",
            "desc": "Your Delivery Sathi is assigned",
            "orderId": order._id
        })

        res.json({
            success: true
        })

    }
    catch(err){
        next(err)
    }
})

module.exports = router;