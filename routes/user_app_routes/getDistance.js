const express = require('express');
const router = express.Router();
const axios = require('axios');
const print = require('../../util/printFullObject')


router.get('/getDistance',async (req,res)=>{
    const distanceRes = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${req.query.destinations}&origins=${req.query.origins}&key=AIzaSyCjGoldXj1rERZHuTyT9iebSRFc_O3YHX4`);
    let distance = Number.parseInt(distanceRes.data['rows'][0]['elements'][0]['distance']['value'])/1000.0;
    
    console.log(distance);

    if(distance <= 1.5){
        res.json({distance: "10"});
        return;
    }
    else if(distance <= 3){
        res.json({distance: "30"});
        return;
    }
    else if(distance <= 5){
        res.json({distance: "50"});
        return;
    }
    else {
        distance -= 5;
        let amount = Math.ceil(50 + distance);
        res.json({distance: amount});
        return;
    }
    
})

module.exports = router;