const express = require('express')
const client = require('../../../util/init_redis')
const Shop = require('../../../models/Shop')
const Order = require('../../../models/Order')
const DeliverySathi = require('../../../models/DeliverySathi')
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
            const deliverySathiFromDb = await DeliverySathi.findOne({phoneNo: allKeys[i]})

            let mappedSathi = {
                "deliverySathi":{
                    "phoneNo": allKeys[i],
                    "latitude": currSathi.latitude,
                    "longitude": currSathi.longitude
                }
            }

            const orders = await Order.find({
                assignedDeliveryBoy: allKeys[i],
                orderAcceptedByDeliverySathi: true,
                orderStatus: { $lt: 6 }
            })

            if(orders == null || orders.length == 0){
                mappedDeliverySathis.push({...mappedSathi,"currOrders": deliverySathiFromDb.currOrders})
                continue;
            }

            if(orders != null){
                
                const mappedOrders = []
                for(let i=0;i<orders.length;i++){
                    const order = orders[i];

                    const shopData = await Shop.findOne({_id: order.shopID})
                
                    mappedOrders.push({
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
                        }
                    })
                }


                mappedSathi = {
                    ...mappedSathi,
                    "orderDetailsList": mappedOrders,
                    "currOrders": deliverySathiFromDb.currOrders
                }
                
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