const express = require('express');
const router = express.Router();
const Order = require('../../../models/Order');
const User = require('../../../models/User');
const notificationConstants = require('../../../util/notificationConstants');
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
    
        let notificationKey;
        if(order.orderStatus == 1){
            notificationKey = "order_in_preperation"
        }
        else if(order.orderStatus == 2){
            notificationKey = "order_in_preperation"
        }
        else if(order.orderStatus == 3){
            notificationKey = "out_for_delivery"
        }
    
        const user = await User.findOne({phoneNo: order.userId});
        sendNotification(user.fcmId,{
            "data": "assdgsdg",
            "type": "order_status_change",
            ...notificationConstants[`${notificationKey}`],
            "orderId": orderId
        })
    
        res.json({success: true});

    } catch (error) {
        next(error)
    }


})



module.exports = router;