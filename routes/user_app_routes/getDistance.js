const express = require('express');
const router = express.Router();
const axios = require('axios');
const print = require('../../util/printFullObject')

// TODO: Get this from redis cache
const ABOVE_DISTANCE_FIVE_PRICE = 15;
const BELOW_DISTANCE_FIVE_PRICE = 5;

router.get('/getDistance',async (req,res,next)=>{

    try {
        const distanceRes = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${req.query.destinations}&origins=${req.query.origins}&key=AIzaSyCjGoldXj1rERZHuTyT9iebSRFc_O3YHX4`);
        let distance = Number.parseInt(distanceRes.data['rows'][0]['elements'][0]['distance']['value'])/1000.0;
        
        console.log(distance)
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



module.exports = router;