const express = require('express');
const Order = require('../../../models/Order')
const User = require('../../../models/User')
const sendNotification = require('../../../util/sendNotification');
const router = express.Router();


router.get('/partner/reject_order',async (req,res)=>{
    // change order statues
    const order_id = req.query.order_id;
    const user_id = req.query.user_id;

    const order = await Order.findOne({_id: order_id});
    order.orderStatus = 8;
    order.save();

    User.findOne({phoneNo: user_id}).then((user)=>{
        sendNotification(user.fcmId,{"data": "sdgsdg"})
    })

    res.send({success: true});
})


module.exports = router;