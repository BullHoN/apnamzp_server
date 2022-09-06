const express = require('express')
const client = require('../../../util/init_redis')
const Shop = require('../../../models/Shop')
const Order = require('../../../models/Order')
const router = express.Router()

router.get('/apna_mzp/admin/delivery_sathis', async (req,res,next)=>{
    try{
        let deliverySathis = await client.get('deliverySathis');
        if(deliverySathis == null) deliverySathis = "{}"

        deliverySathis = JSON.parse(deliverySathis);

        let mappedDeliverySathis = []
        let allKeys = Object.keys(deliverySathis)
        for(let i=0;i<allKeys.length;i++){
            let currSathi = deliverySathis[allKeys[i]]

            let mappedSathi = {
                "deliverySathi":{
                    "phoneNo": allKeys[i],
                    "latitude": currSathi.latitude,
                    "longitude": currSathi.longitude
                }
            }

            if(currSathi.orderId != null){
                const order = await Order.findOne({_id: currSathi.orderId})

                if(order == null){
                    mappedDeliverySathis.push(mappedSathi)
                    continue;
                }

                if(order.orderStatus > 4){
                    mappedDeliverySathis.push(mappedSathi)
                    continue;
                }
                
                const shopData = await Shop.findOne({_id: order.shopID})
                

                mappedSathi = {...mappedSathi,
                "shopData": {
                    "name": shopData.name,
                    "phoneNo": shopData.phoneNO,
                    "rawAddress": shopData.addressData.mainAddress,
                    "latitude": shopData.addressData.latitude,
                    "longitude": shopData.addressData.longitude
                },
                "customerData": {
                    "phoneNo": order.userId,
                    "rawAddress": order.deliveryAddress.rawAddress,
                    "latitude": order.deliveryAddress.latitude,
                    "longitude": order.deliveryAddress.longitude
                }}
            }

            mappedDeliverySathis.push(mappedSathi)
        }

        res.json(mappedDeliverySathis)
    }
    catch(err){
        next(err)
    }
})


module.exports = router;