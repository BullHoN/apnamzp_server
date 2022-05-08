const express = require('express');
const router = express.Router();
const Order = require('../../../models/Order');
const User = require('../../../models/User');
const sendNotification = require('../../../util/sendNotification')

router.post('/partner/order/updateStatus',async (req,res)=>{
    const {orderId, orderStatus} = req.query; 

    const order = await Order.findOne({_id: orderId});
    order.orderStatus = orderStatus;
    order.save();

    const user = await User.findOne({phoneNo: order.userId});
    sendNotification(user.fcmId,{
        "data": "assdgsdg",
        "type": "order_status_change",
        "title": "kuch to huaa hai",
        "desc": "kuch ho to rha hai",
        "orderId": orderId
    })

    res.json({status: true});
})


module.exports = router;