const express = require('express');
const Order = require('../../../models/Order')
const User = require('../../../models/User')
const Shop = require('../../../models/Shop')
const sendNotification = require('../../../util/sendNotification');
const notificationConstants = require('../../../util/notificationConstants')
const axios = require('axios')
const router = express.Router();
const delayPreperationTimeAlert = require('../../../alerts/delay_preperation_time.alert')
const delayDeliveryAlert = require('../../../alerts/delay_delivery.alert')


router.get('/partner/accept_order',async (req,res,next)=>{

    // change order statues
    const order_id = req.query.order_id;
    const user_id = req.query.user_id;
    const expected_time = req.query.expected_time;

    try{

        const orderStatus = await Order.findOne({_id: order_id})
        if(orderStatus.orderStatus > 1){
            res.send({success: true});
            return;
        }

        const order = await Order.findOneAndUpdate({_id: order_id},{orderStatus: 1,expectedDeliveryTime: expected_time},{new: true})

        delayPreperationTimeAlert(order_id,expected_time)
        delayDeliveryAlert(order_id,expected_time)

        const waitingTime = Number.parseInt(expected_time.split('m')[0]) - 15;
        
        if(waitingTime <= 0){
            await assignDeliverySathi(order)
        }
        else {
            setTimeout(async ()=>{
                await assignDeliverySathi(order)
            },waitingTime * 60 * 1000)
        }


        User.findOne({phoneNo: user_id}).then((user)=>{
            if(user){
                sendNotification(user.fcmId,{
                    "data":"zeher",
                    "type": "order_status_accept",
                    ...notificationConstants["order_accepted"],
                    "orderId": order_id
                })
            }
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

async function assignDeliverySathi(order){

    if(!order.billingDetails.isDeliveryService){
        return
    }

    const shopData = await Shop.findOne({_id: order.shopID})
    let tries = 0;

    const deliverySathiAssignInterval = setInterval(async ()=>{

        if(tries++ > 2){
            clearInterval(deliverySathiAssignInterval)
        }

        try{
            const assginedRes = await axios.post(`${process.env.HTTP_HOST}://${process.env.HOST_NAME}/partner/assignDeliveryBoy?orderId=${order._id}&latitude=${shopData.addressData.latitude}&longitude=${shopData.addressData.longitude}`,{})
            clearInterval(deliverySathiAssignInterval)
            if(assginedRes.success){
                clearInterval(deliverySathiAssignInterval)
            }
        }
        catch(err){
            console.log(err)
        }

    },1000)
}

module.exports = router;