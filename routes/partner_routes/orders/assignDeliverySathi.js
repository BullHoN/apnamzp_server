const express = require('express');
const router = express.Router();
const geolib = require('geolib');
const localDB = require('../../../util/localDB/localDB');
const Order = require('../../../models/Order')

// {latitude: "25.133699", longitude: "82.564430"}
// 25.13649844681555, 82.56680760096513
// 28.84196614894497, 77.57740291535762

router.post('/partner/assignDeliveryBoy',async (req,res)=>{

    let deliverySathis = await localDB.get('deliverySathis');
    deliverySathis = JSON.parse(deliverySathis);

    let assignedDeliveryBoy = {dist: Number.MAX_SAFE_INTEGER}
    Object.keys(deliverySathis).forEach((key,idx)=>{
        const curr = deliverySathis[key];
        const dist = getDistance({latitude: Number.parseFloat(curr["latitude"]),longitude: Number.parseFloat(curr["longitude"])}
        ,{latitude: 25.133699, longitude: 82.564430});

        if(dist < assignedDeliveryBoy.dist){
            assignedDeliveryBoy = curr;
            assignedDeliveryBoy.dist = dist;
        }

    })

    await Order.findByIdAndUpdate({_id: req.query.orderId},{assignedDeliveryBoy: assignedDeliveryBoy.phoneNo});

    res.json(assignedDeliveryBoy);
})

function getDistance(from,to){
    return geolib.getDistance(from,to);
}


module.exports = router;