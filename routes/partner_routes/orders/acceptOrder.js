const express = require('express');
const Order = require('../../../models/Order')
const User = require('../../../models/User')
const sendNotification = require('../../../util/sendNotification');
const router = express.Router();

router.get('/partner/accept_order',async (req,res,next)=>{

    // change order statues
    const order_id = req.query.order_id;
    const user_id = req.query.user_id;
    const expected_time = req.query.expected_time;

    try{
        await Order.findOneAndUpdate({_id: order_id},{orderStatus: 1,expectedDeliveryTime: expected_time})

        User.findOne({phoneNo: user_id}).then((user)=>{
            sendNotification(user.fcmId,{
                "data":"zeher",
                "type": "order_status_accept",
                "title": "ha bol diya bhai",
                "desc": "khana to aa hi jayga",
                "orderId": order_id
            })
        })
        .catch((err)=>{
            if(err) throw err;
        })
    
        res.send({success: true});
    }
    catch(err){
        next(err)
    }

})


module.exports = router;