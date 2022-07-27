const express = require('express')
const Order = require('../../../models/Order')
const sendNotification = require('../../../util/sendNotification')
const DeliverySathi = require('../../../models/DeliverySathi')
const ShopData = require('../../../models/Shop')
const client = require('../../../util/init_redis')
const router = express.Router()

router.post('/apna_mzp/admin/assign_delivery_sathi', async (req,res,next)=>{
    const { orderId, deliverySathiNo } = req.query

    try{
        const order = await Order.findOne({_id: orderId})
        order.assignedDeliveryBoy = deliverySathiNo
        await order.save()

        const shopData = await ShopData.findOne({_id: order.shopID})
        const deliverySathi = await DeliverySathi.findOne({phoneNo: deliverySathiNo})

        let pendingOrders = await client.get("pendingOrders")
        pendingOrders = JSON.parse(pendingOrders)

        pendingOrders = pendingOrders.filter((od)=>{
            return (od._id != orderId)
        })

        await client.set("pendingOrders",JSON.stringify(pendingOrders))

        sendNotification(deliverySathi.fcmId,{
            "data": JSON.stringify({
                shopInfo: {
                    name: shopData.name,
                    phoneNo: shopData.phoneNO,
                    rawAddress: shopData.addressData.mainAddress,
                    latitude: shopData.addressData.latitude,
                    longitude: shopData.addressData.longitude
                },
                adminShopService: order.adminShopService,
                orderItems: order.orderItems,
                _id: orderId
            }),
            "type": "order",
            "title": "nya order aa gya bhai",
            "desc": "jake de aa order bhai" 
        })



        res.json({
            success: true
        })

    }
    catch(err){
        next(err)
    }
})

module.exports = router