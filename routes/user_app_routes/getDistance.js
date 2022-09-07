const express = require('express');
const router = express.Router();
const axios = require('axios');
const print = require('../../util/printFullObject')
const Shop = require('../../models/Shop')
const geolib = require('geolib');
const HttpError = require('http-errors')

// TODO: Get this from redis cache
const ABOVE_DISTANCE_FIVE_PRICE = 15;
const BELOW_DISTANCE_FIVE_PRICE = 5;

router.get('/getDistance',async (req,res,next)=>{

    try {

        const customerInRange = await isUserLocationReachable(req.query.destinations)
        if(!customerInRange){
            // throw HttpError.BadRequest("Sorry our service is not available in your area.")
            res.json({distance: "-1", actualDistance: "-1"});
            return;
        }

        const distanceRes = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${req.query.destinations}&origins=${req.query.origins}&key=AIzaSyCjGoldXj1rERZHuTyT9iebSRFc_O3YHX4`);
        let distance = Number.parseInt(distanceRes.data['rows'][0]['elements'][0]['distance']['value'])/1000.0;
        
        if(distance <= 2.5){
            // TODO: Get all this from redis cache
            res.json({distance: "25", actualDistance: distance});
            return;
        }
        else if(distance <= 6){
            let amount = 25 + Math.ceil(Math.ceil(distance)-2.5) * BELOW_DISTANCE_FIVE_PRICE
            res.json({distance: (amount+""), actualDistance: distance});
            return;
        }
        else if(distance <= 8){
            let amount = Math.ceil(distance) * ABOVE_DISTANCE_FIVE_PRICE;
            res.json({distance: (amount+""), actualDistance: distance})
        }
        else {
            res.json({distance: "-1", actualDistance: "-1"});
            return;
        }        
    } catch (error) {
        next(error)
    }
    
})

async function isUserLocationReachable(custLatLang){
    const shops = await Shop.find({})

    let shops_around_customer = 0;
    for(let i=0;i<shops.length;i++){
        const shop = shops[i]

        const cusLat = custLatLang.split("%2C")[0]
        const custLong = custLatLang.split("%2C")[1]

        let dist = getDistance(
            {
                latitude: Number.parseFloat(cusLat),
                longitude: Number.parseFloat(custLong)
            },
            {
                latitude: Number.parseFloat(shop.addressData.latitude),
                longitude: Number.parseFloat(shop.addressData.longitude)
            }
        );

        dist = dist / 1000.0

        if(Math.ceil(dist) <= 3){
            shops_around_customer++;
        }

    }

    return (shops_around_customer < 2) ? false : true;

}

function getDistance(from,to){
    return geolib.getDistance(from,to);
}


module.exports = router;