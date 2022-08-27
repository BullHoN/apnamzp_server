const express = require('express');
const router = express.Router();
const client = require('../../util/init_redis')

// TODO: get these from redis
let itemsOnTheWayCostDefault = 10;
let slurgeChargesDefault = 10;
let slurgeReasonDefault = "barish hai bhaiya kha se le ay khana aapka";
let processingFeeDefault =  { init: 10, inc: 5, jump: 100 }

router.get('/user/cart/metadata',async (req,res,next)=>{

    try{

        const itemsOnTheWayCost = await client.get("itemsOnTheWayCost")
        if(itemsOnTheWayCost == null) await client.set("itemsOnTheWayCost",itemsOnTheWayCostDefault,{
            'EX': 365 * 24 * 60 * 60
        })
        const slurgeCharges = await client.get("slurgeCharges")
        if(slurgeCharges == null) await client.set("slurgeCharges",slurgeChargesDefault,{
            'EX': 365 * 24 * 60 * 60
        })

        const slurgeReason = await client.get("slurgeReason")
        if(slurgeReason == null) await client.set("slurgeReason",slurgeReasonDefault,{
            'EX': 365 * 24 * 60 * 60
        })

        let processingFee = await client.get("processingFee")
        if(processingFee == null) await client.set("processingFee",JSON.stringify(processingFeeDefault),{
            'EX': 365 * 24 * 60 * 60
        })
        else processingFee = JSON.parse(processingFee)

        res.json({
            itemsOnTheWayCost: itemsOnTheWayCost || itemsOnTheWayCostDefault,
            slurgeCharges: slurgeCharges || slurgeChargesDefault,
            slurgeReason: slurgeReason || slurgeReasonDefault,
            processingFee: processingFee || processingFeeDefault
        })
    }
    catch(err){
        next(err)
    }

})

module.exports = router;