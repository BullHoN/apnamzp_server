const express = require('express');
const Order = require('../../models/Order')
const Shop = require('../../models/Shop')
const router = express.Router();

router.get('/sathi/orders/:delivery_sathi',async (req,res,next)=>{
    const delivery_sathi = req.params.delivery_sathi;
    const order_status = req.query.order_status;

    try{
        let orders;
        if(order_status == 5){
            orders = await Order.find({assignedDeliveryBoy: delivery_sathi,
                orderStatus: Number.parseInt(order_status), orderAcceptedByDeliverySathi: true});
        }
        else {
            orders = await Order.find({assignedDeliveryBoy: delivery_sathi,
                orderStatus: {
                    $lte: Number.parseInt(order_status)
                },
                orderAcceptedByDeliverySathi: true
            });
        }
    
    
        let mappedOrders = []
        for(let i=0;i<orders.length;i++){
            const order = orders[i];
            const shop = await Shop.findOne({_id: order.shopID})
            mappedOrders.push({
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
                    name: "vaibhav", //TODO: change this default value
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
                deliverySathiIncome: order.deliverySathiIncome
            })
        }

        res.json(mappedOrders);
    }
    catch(error){
        next(error)
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

// function mapOrders(orders){
//     return new Promise((resolve,reject)=>{
        
//     })    
// }

module.exports = router;