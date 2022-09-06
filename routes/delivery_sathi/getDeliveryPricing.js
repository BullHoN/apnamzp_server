const express = require('express');
const client = require('../../util/init_redis')
const router = express.Router();

// TODO: Get this from redis
const deliveryPricingDefault = [
    {
        message: "Less Than Equal to 2KM",
        value: "15"
    },
    {
        message: "Less Than Equal to 4KM",
        value: "20"
    },
    {
        message: "After 3KM",
        value: "4/Km"
    },
    {
        message: "For Out Of Location(Above 4KM) \n (Return Distance=total distance - 4)",
        value: "2/Km return"
    },
]

// 
const incentiveDefault = [
    {
        message: "6 Orders",
        value: "30"
    },
    {
        message: "9 Orders",
        value: "50"
    }
]

router.get('/getDeliveryPriceInfoSathi',async (req,res,next)=>{
    try{
        const deliveryPricing = await client.get("deliveryPricing")
        if(deliveryPricing == null) await client.set("deliveryPricing",JSON.stringify(deliveryPricingDefault))
        else deliveryPricing = JSON.parse(deliveryPricing)

        res.json(deliveryPricing || deliveryPricingDefault);
    }
    catch(err){
        next(err)
    }
})

router.get('/getIncentivePriceInfoSathi',async (req,res,next)=>{
   try{
    const incentivePricings = await client.get("incentivePricings")
    if(incentivePricings == null) await client.set("incentivePricings",JSON.stringify(incentiveDefault))
    else incentivePricings = JSON.parse(incentivePricings)

    res.json(deliveryPricing || incentiveDefault);
   }
   catch(err){
    next(err)
   }
})

module.exports = router;