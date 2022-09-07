const express = require('express')
const Order = require('../../models/Order')
const Shop = require('../../models/Shop')
const router = express.Router()

router.get('/sathi/:phoneNo/not-responded-orders', async (req,res,next)=>{
    try {
        const orders = await Order.find({
            assignedDeliveryBoy: req.params.phoneNo,
            orderAcceptedByDeliverySathi: false,
            orderStatus: { $not: { $gte: 6 } }
        })

        let results = []
        for(let i=0;i<orders.length;i++){
            const order = orders[i]
            const shopData = await Shop.findOne({_id: order.shopID})

            results.push({
                shopInfo: {
                    name: shopData.name,
                    phoneNo: shopData.phoneNO,
                    rawAddress: shopData.addressData.mainAddress,
                    latitude: shopData.addressData.latitude,
                    longitude: shopData.addressData.longitude
                },
                adminShopService: order.adminShopService,
                orderItems: order.orderItems,
                _id: order._id
            })
        }

        res.json(results)
    }
    catch(err){
        next(err)
    }
})

module.exports = router