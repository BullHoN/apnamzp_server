const express = require('express');
const Order = require('../../../models/Order')
const User = require('../../../models/User')
const sendNotification = require('../../../util/sendNotification');
const router = express.Router();

router.get('/partner/accept_order',async (req,res)=>{

    // change order statues
    const order_id = req.query.order_id;
    const user_id = req.query.user_id;

    await Order.findOneAndUpdate({_id: order_id},{orderStatus: 1})

    User.findOne({phoneNo: user_id}).then((user)=>{
        sendNotification(user.fcmId,{"data":"zeher"})
    })

    res.send({success: true});
})


module.exports = router;