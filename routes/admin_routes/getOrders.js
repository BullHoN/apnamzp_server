const express = require('express')
const Order = require('../../models/Order')
const Shop = require('../../models/Shop')
const User = require('../../models/User')
const router = express.Router()

router.get('/apna_mzp/admin/orders', async (req,res,next)=>{
    const { phoneNo, orderId } = req.query
    try{
        let orders;
        if(phoneNo){
            orders = await Order.find({userId: phoneNo,
                orderStatus: { $gte: 0, $lt: 6}})
        }
        else if(orderId){
            orders = await Order.find({_id: orderId})
        }
        else {
            orders = await Order.find({orderStatus: { $gte: 0, $lt: 6}})
        }
        
            let mappedOrders = []
            for(let i=0;i<orders.length;i++){
                const order = orders[i];
                const shop = await Shop.findOne({_id: order.shopID})
                const user = await User.findOne({phoneNo: order.userId})
                const allUserOrders = await Order.find({userId: order.userId}).limit(2)
                    
                mappedOrders.push({
                    ...order._doc,
                    _id: order._id.toString(),
                    orderItems: order.orderItems,
                    shopInfo: {
                        name: shop.name,
                        latitude: shop.addressData.latitude,
                        longitude: shop.addressData.longitude,
                        phoneNo: shop.phoneNO,
                        rawAddress: shop.addressData.mainAddress
                    },
                    userInfo: {
                        name: (user) ? user.name : "Not-Registered",
                        landmark: order.deliveryAddress.landmark,
                        houseNo: order.deliveryAddress.houseNo,
                        latitude: order.deliveryAddress.latitude,
                        longitude: order.deliveryAddress.longitude,
                        phoneNo: order.userId,
                        rawAddress: order.deliveryAddress.rawAddress
                    },
                    itemsOnTheWay: order.itemsOnTheWay,
                    totalAmountToTake: order.billingDetails.totalPay,
                    orderStatus: order.orderStatus,
                    isPaid: order.isPaid,
                    totalAmountToGive: totalAmountToGive(order),
                    itemsOnTheWayCancelled: order.itemsOnTheWayCancelled,
                    itemsOnTheWayActualCost: order.billingDetails.itemsOnTheWayActualCost,
                    billingDetails: order.billingDetails,
                    isNewCustomer: allUserOrders.length == 1
                })
            }

        res.json(mappedOrders)
    }
    catch(err){
        next(err)
    }
})

function totalAmountToGive(order){
    let totalReceivingAmount = 0;
    if(order.offerCode != null && !order.offerCode.includes("APNA")){
        totalReceivingAmount =  order.billingDetails.itemTotal + order.billingDetails.totalTaxesAndPackingCharge  - order.billingDetails.totalDiscount;
    }
    else {
        totalReceivingAmount =  order.billingDetails.itemTotal +  order.billingDetails.totalTaxesAndPackingCharge  - order.billingDetails.totalDiscount - order.billingDetails.offerDiscountedAmount;
    }

    if(order.billingDetails.itemTotal >= order.billingDetails.freeDeliveryPrice){
        totalReceivingAmount -= order.billingDetails.deliveryCharge;
    }

    return  totalReceivingAmount;
}

module.exports = router