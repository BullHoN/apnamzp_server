const express = require('express');
const router = express.Router();
const Order = require('../../../models/Order')
const Shop = require('../../../models/Shop')

router.get('/user/getOrder',async(req,res,next)=>{
    const order_id = req.query.order_id;
    try {
        const order = await Order.findOne({_id: order_id})
        const mappedShopData = await mapOrderWithShopDetails(order);
        res.json(mappedShopData)
    } catch (error) {
        next(error)
    }
})

async function mapOrderWithShopDetails(order){
    return new Promise(async (resolve,reject)=>{
        let mappedOrders = [];
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
                itemsOnTheWay: order.itemsOnTheWay,
                assignedDeliveryBoy: order.assignedDeliveryBoy,
                itemsOnTheWayCancelled: order.itemsOnTheWayCancelled,
                created_at: order.created_at
            });
        resolve(mappedOrders[0]);
    })
}


module.exports = router;