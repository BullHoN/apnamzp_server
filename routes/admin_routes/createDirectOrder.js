const express = require('express')
const client = require('../../util/init_redis')
const Order = require('../../models/Order')
const Shop = require('../../models/Shop')
const ShopPartner = require('../../models/ShopPartner')
const sendNotification = require('../../util/sendNotification')
const HttpErrors = require('http-errors')
const router = express.Router()


router.post('/apna_mzp/admin/direct-order', async (req,res,next)=>{
    try {

        const order = await Order.create(req.body);

        if(!order){
            throw HttpErrors.BadRequest("Something went wrong");
        }

        if(!order.adminShopService){

            const shopData = await Shop.findOne({_id: req.body.shopID});
            const shopUser = await ShopPartner.findOne({phoneNo: shopData.phoneNO});
            
            if(!shopData.isOpen){
                throw HttpErrors.BadRequest("Shop is currently closed please try again later")
            }
    
            if(!shopData.allowCheckout){
                throw HttpErrors.BadRequest("Shop is currently unavaible for delivery service")
            }
    
            if(shopData.adminShopService){
                order.paymentReceivedToShop = true
            }
    

            sendNotification(shopUser.fcmId,{
                "orderItems":  JSON.stringify(req.body.orderItems),
                "_id": order._id.toString(),
                "userId": req.body.userId,
                "type": "new_order",
                "totalPay":  (getTotalReceivingAmount(order.billingDetails,order.offerCode) + ""),
                "isDeliveryService": ((order.billingDetails.isDeliveryService == true) + ""),
            })

            res.json({
                success: true
            })    

            return;
        }
        

        let pendingOrders = await client.get("pendingOrders")
        if(pendingOrders == null) pendingOrders = []
        else pendingOrders = JSON.parse(pendingOrders)

        pendingOrders.push(order)

        await client.set("pendingOrders",JSON.stringify(pendingOrders))

        res.json({
            success: true
        })

    }
    catch (err) {
        next(err)
    }
})

function getTotalReceivingAmount(billingDetails,offerCode){
    let totalReceivingAmount = billingDetails.itemTotal + billingDetails.totalTaxesAndPackingCharge + billingDetails.totalTaxesAndPackingCharge
    if(offerCode != null && offerCode != "" && !offerCode.includes("APNA")){
        totalReceivingAmount -= offerDiscountedAmount
    }

    if(billingDetails.itemTotal >= billingDetails.freeDeliveryPrice){
        totalReceivingAmount -= billingDetails.deliveryCharge
    }

    return totalReceivingAmount
}

module.exports = router