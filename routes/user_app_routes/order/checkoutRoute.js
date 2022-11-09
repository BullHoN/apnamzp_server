const express = require('express');
const Order = require('../../../models/Order');
const ShopPartner = require('../../../models/ShopPartner');
const Shop = require('../../../models/Shop');
const sendNotification = require('../../../util/sendNotification');
const createError = require('http-errors');
const axios = require('axios').default
const router = express.Router();
const client = require('../../../util/init_redis')
const resturantNotRespondedAlert = require('../../../alerts/resturant_not_responded.alert')


router.post('/checkout',async (req,res,next)=>{

    try {   
        let blockedCODUsers = await client.get("blockedCODUsers")
        if(blockedCODUsers) blockedCODUsers = JSON.parse(blockedCODUsers)
        else {
            blockedCODUsers = []
            client.set("blockedCODUsers",JSON.stringify([]))
        }

        const order = new Order(req.body);

        for(let i=0;i<blockedCODUsers.length;i++){
            if(blockedCODUsers[i] == order.userId && !order.isPaid){
                throw createError.BadRequest("You Have Been Blocked By Resturant, Please Try Prepaid Order Or Contact Apna Mzp")
            }
        }

        // self service is only when order is managed by shop
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

        if(shopData.adminShopService){
            order.paymentReceivedToShop = true
            order.expectedDeliveryTime = "15min"
        }

        await order.save();
        

        
        if(order.adminShopService){
            const deliverySathiAssignInterval = setInterval(async ()=>{

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
        else {
            sendNotification(shopUser.fcmId,{
                "orderItems":  JSON.stringify(req.body.orderItems),
                "_id": order._id.toString(),
                "userId": req.body.userId,
                "type": "new_order",
                "totalPay":  (getTotalReceivingAmount(order.billingDetails,order.offerCode) + ""),
                "isDeliveryService": ((order.billingDetails.isDeliveryService == true) + ""),
            })
        }

        resturantNotRespondedAlert(order._id,order.adminShopService)

        res.json({
            success: true
        });        
        
    } catch (error) {
        next(error)
    }

})


function getTotalReceivingAmount(billingDetails,offerCode){
    let totalReceivingAmount = billingDetails.itemTotal + billingDetails.totalTaxesAndPackingCharge + billingDetails.totalTaxesAndPackingCharge
    if(offerCode != null && offerCode != "" && !offerCode.includes("APNA")){
        totalReceivingAmount -= billingDetails.offerDiscountedAmount
    }

    if(billingDetails.itemTotal >= billingDetails.freeDeliveryPrice){
        totalReceivingAmount -= billingDetails.deliveryCharge
    }

    return totalReceivingAmount
}



module.exports = router;
