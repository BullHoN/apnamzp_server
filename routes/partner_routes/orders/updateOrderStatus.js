const express = require('express');
const router = express.Router();
const Order = require('../../../models/Order');
const User = require('../../../models/User');
const sendNotification = require('../../../util/sendNotification')

router.post('/partner/order/updateStatus',async (req,res,next)=>{
    const {orderId, orderStatus, shopReceivedPayment} = req.query; 

    console.log(orderId,orderStatus);

    try {
        const order = await Order.findOne({_id: orderId});

        if(order.orderStatus > Number.parseInt(orderStatus)){
            order.orderStatus += 1;
        }
        else {
            order.orderStatus = Number.parseInt(orderStatus);
        }


        // TODO: make a check for the updated value for the delivery sathi status

        if(order.orderStatus == 4){
            order.paymentReceivedToShop = (shopReceivedPayment == "true")
        }
        
        const isDeliveryService = order.billingDetails.isDeliveryService;

        if(order.orderStatus == 4 && !isDeliveryService){
            order.orderStatus = 6;
        }
        

        await order.save();
    
    
        const user = await User.findOne({phoneNo: order.userId});
        sendNotification(user.fcmId,{
            "data": "assdgsdg",
            "type": "order_status_change",
            "title": "kuch to huaa hai",
            "desc": "kuch ho to rha hai",
            "orderId": orderId
        })
    
        res.json({success: true});

    } catch (error) {
        next(error)
    }


})



module.exports = router;