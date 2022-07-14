const express = require('express');
const router = express.Router();

const deliveryPricing = [
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

router.get('/getDeliveryPriceInfoSathi',(req,res)=>{
    res.json(deliveryPricing);
})

router.get('/getIncentivePriceInfoSathi',(req,res)=>{
    res.json([
        {
            message: "6 Orders",
            value: "30"
        },
        {
            message: "9 Orders",
            value: "50"
        }
    ])
})

module.exports = router;