const express = require('express');
const Order = require('../../../models/Order');
const ShopPartner = require('../../../models/ShopPartner');
const Shop = require('../../../models/Shop');
const sendNotification = require('../../../util/sendNotification');
const createError = require('http-errors')
const router = express.Router();


router.post('/checkout',async (req,res,next)=>{

    try {
        console.log(req.body)
        const order = new Order(req.body);

        if(!order.billingDetails.isDeliveryService){
            order.billingDetails.deliveryCharge = 0
        }
        

        // send notification to the shop
        const shopData = await Shop.findOne({_id: req.body.shopID});
        const shopUser = await ShopPartner.findOne({phoneNo: shopData.phoneNO});
        
        if(!shopData.isOpen){
            throw createError.BadRequest("Shop is currently closed please try again later")
        }

        if(!shopData.allowCheckout){
            throw createError.BadRequest("Shop is currently unavaible for delivery service")
        }

        await order.save();
    
        sendNotification(shopUser.fcmId,{
            "orderItems":  JSON.stringify(req.body.orderItems),
            "_id": order._id.toString(),
            "userId": req.body.userId,
            "type": "new_order",
            "totalPay": (req.body.billingDetails.totalPay + ""),
            "isDeliveryService": ((order.billingDetails.isDeliveryService == true) + ""),
        })
    
        res.json({
            success: true
        });        
        
    } catch (error) {
        next(error)
    }

})



module.exports = router;
