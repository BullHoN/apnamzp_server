const express = require('express');
const Order = require('../../../models/Order');
const Shop = require('../../../models/Shop')
const router = express.Router();

router.get('/user/getOrders',async (req,res,next)=>{
    const userId = req.query.userId;

    try{
        const orders = await Order.find({userId: userId}).sort({ created_at: -1 });
        const mappedOrders = await mapOrderWithShopDetails(orders);
    
        res.json(mappedOrders);
    }
    catch(error){
        next(error)
    }

})

async function mapOrderWithShopDetails(orders){
    return new Promise(async (resolve,reject)=>{
        let mappedOrders = [];
        for(let i=0;i<orders.length;i++){
            const order = orders[i];
            const shopData = await Shop.findOne({_id: order.shopID});
            
            mappedOrders.push({
                _id: order._id,
                orderItems: order.orderItems,
                isPaid: order.isPaid,
                shopID: order.shopID,
                deliveryAddress: order.deliveryAddress,
                userId: order.userId,
                shopCategory: order.shopCategory,
                billingDetails: order.billingDetails,
                orderStatus: order.orderStatus,
                cancelled: order.cancelled,
                shopData: {
                    name: shopData.name,
                    bannerImage: shopData.bannerImage,
                    addressData: shopData.addressData
                },
                cancelReason: order.cancelReason,
                assignedDeliveryBoy: order.assignedDeliveryBoy,
                itemsOnTheWay: order.itemsOnTheWay,
                created_at: order.created_at
            });
        }
        resolve(mappedOrders);
    })
}


module.exports = router;