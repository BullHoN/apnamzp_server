const express = require('express');
const Order = require('../../../models/Order')
const User = require('../../../models/User')
const sendNotification = require('../../../util/sendNotification');
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
    
        User.findOne({phoneNo: user_id}).then((user)=>{
            sendNotification(user.fcmId,{
                "data": "sdgsdg",
                "type": "order_status_rejected",
                "title": "na bol diya bhai",
                "desc": "mna kar diya usne abb hm kya kar sakte hai" ,
                "orderId": order_id          
            })
        })
        .catch((err)=> {
            if(err) throw err;
        })
    
        res.send({success: true});
    }
    catch(err){
        next(err)
    }

})


module.exports = router;