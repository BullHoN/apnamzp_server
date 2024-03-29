const express = require('express');
const router = express.Router();
const axios = require('axios');
const print = require('../../util/printFullObject')
const Shop = require('../../models/Shop')
const geolib = require('geolib');
const HttpError = require('http-errors')
const client = require('../../util/init_redis')

// TODO: Get this from redis cache
const ABOVE_DISTANCE_FIVE_PRICE = 15;
const BELOW_DISTANCE_FIVE_PRICE = 5;

const EDGE_LOCATIONS_DEFAULT = [ "jangi", "lohandi", "gango", "kirtarrata"]
const EDGE_LOCATION_DEFAULT_INC = 20

const PRICING_DEFAULT = {
    BELOW_THREE: 25,
    BELOW_SIX: 25
}

const DEFAULT_Locations_NOT_ALLOWED_COD = []

router.all('/getDistance',async (req,res,next)=>{

    try {
        const body = req.body
        const distanceRes = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${req.query.destinations}&origins=${req.query.origins}&key=AIzaSyCjGoldXj1rERZHuTyT9iebSRFc_O3YHX4`);
        let distance = Number.parseInt(distanceRes.data['rows'][0]['elements'][0]['distance']['value'])/1000.0;
        const destinationRawAddress = distanceRes.data.destination_addresses.join('')

        const customerInRange = await isUserLocationReachable(req.query.destinations)
        if(!customerInRange && !destinationRawAddress.includes("Barkachhakalan")){
            // throw HttpError.BadRequest("Sorry our service is not available in your area.")
            res.json({distance: "-1", actualDistance: "-1"});
            return;
        }

        let edgeLocationsData = await client.get("edgeLocationsData")
        if(edgeLocationsData) edgeLocationsData = JSON.parse(edgeLocationsData)
        else {
            edgeLocationsData = {
                locations: EDGE_LOCATIONS_DEFAULT,
                priceInc: EDGE_LOCATION_DEFAULT_INC
            }

            await client.set("edgeLocationsData", JSON.stringify(edgeLocationsData))
        }

        let extraCharges = edgeLocationsCharges(distanceRes.data.destination_addresses[0]
            , edgeLocationsData.locations, edgeLocationsData.priceInc)
        
        console.log(extraCharges)

        let deliveryPricings =  await client.get("deliveryPricings")
        if(deliveryPricings) deliveryPricings = JSON.parse(deliveryPricings)
        else {
            deliveryPricings = PRICING_DEFAULT
            await client.set("deliveryPricings", JSON.stringify(deliveryPricings))
        }

        if(body.BELOW_THREE){
            deliveryPricings.BELOW_THREE = body.BELOW_THREE == -1 ? deliveryPricings.BELOW_THREE : body.BELOW_THREE
            deliveryPricings.BELOW_SIX = body.BELOW_SIX == -1 ? deliveryPricings.BELOW_SIX : body.BELOW_SIX
        }

        let codNotAllowedList = await client.get("codNotAllowedLocations")
        if(codNotAllowedList) codNotAllowedList = JSON.parse(codNotAllowedList)
        else {
            codNotAllowedList = DEFAULT_Locations_NOT_ALLOWED_COD
            await client.set("codNotAllowedLocations",JSON.stringify(codNotAllowedList))
        }

        const isCODEDGELOCATION = isOnlyOnlineLocation(destinationRawAddress,codNotAllowedList)
        if(destinationRawAddress.includes("Barkachhakalan")){
            res.json({distance: 150, actualDistance: distance, edgeLocation: true})
        }
        else if(distance <= 2.5){
            res.json({distance: ((deliveryPricings.BELOW_THREE + extraCharges) + ""), actualDistance: distance, edgeLocation: isCODEDGELOCATION});
            return;
        }
        else if(distance <= 6){
            let amount = deliveryPricings.BELOW_SIX + Math.ceil(Math.ceil(distance)-2.5) * BELOW_DISTANCE_FIVE_PRICE
            res.json({distance: ((amount + extraCharges) +""), actualDistance: distance, edgeLocation: isCODEDGELOCATION});
            return;
        }
        else if(distance <= 8){
            let amount = Math.ceil(distance) * ABOVE_DISTANCE_FIVE_PRICE;
            res.json({distance: ((amount + extraCharges) +""), actualDistance: distance, edgeLocation: isCODEDGELOCATION})
        }
        else {
            res.json({distance: "-1", actualDistance: "-1"});
            return;
        }        
    } catch (error) {
        console.log(error)
        next(error)
    }
    
})

function isOnlyOnlineLocation(destinationRawAddress,codNotAllowedList){

    for(let i=0;i<codNotAllowedList.length;i++){
        const curr = codNotAllowedList[i]
        if(destinationRawAddress.toLowerCase().includes(curr.toLowerCase())){
            return true;
        }
    }

    return false;
}

function edgeLocationsCharges(userAddress, edgeLocations, edgeInc){

    for(let i=0;i<edgeLocations.length;i++){
        const loc = edgeLocations[i]
        if(userAddress.toLowerCase().includes(loc.toLowerCase())){
            return edgeInc
        }
    }

    return 0
}   

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
        console.log(dist,shop.name)

        if(Math.ceil(dist) <= 3){
            shops_around_customer++;
        }

    }

    return (shops_around_customer < 2) ? false : true;

}

function getDistance(from,to){
    return geolib.getPreciseDistance(from,to);
}


module.exports = router;