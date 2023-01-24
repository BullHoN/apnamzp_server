const express = require('express')
const client = require('../../../util/init_redis')
const router = express.Router()

let ttlOptions = {
    'EX': 365 * 24 * 60 * 60
}

router.get('/apna_mzp/admin/userAppData', async (req,res,next)=>{

    try{
        let bannerImages = await client.get("bannerImages")
        let userServiceOpen = await client.get("userServiceOpen")
        if(userServiceOpen == null){ 
            await client.set("userServiceOpen","false",{
                'EX': 365 * 24 * 60 * 60
            })
            userServiceOpen = "false"
        }

        let slurgeCharges = await client.get("slurgeCharges")
        let slurgeReason = await client.get("slurgeReason")
        let itemsOnTheWayCost = await client.get("itemsOnTheWayCost")
        let distanceBasePricings = await client.get("deliveryPricings")

        res.json({
            bannerImages: JSON.parse(bannerImages),
            userServiceOpen: JSON.parse(userServiceOpen),
            slurgeCharges: JSON.parse(slurgeCharges),
            slurgeReason: slurgeReason,
            itemsOnTheWayCost: JSON.parse(itemsOnTheWayCost),
            distanceBasePricings: JSON.parse(distanceBasePricings)
        })

    }
    catch(err){
        next(err)
    }
})

router.post('/apna_mzp/admin/userAppData', async (req,res,next)=>{
    
    try{
        await client.set("userServiceOpen", (req.body.userServiceOpen + ""), ttlOptions)
        await client.set("slurgeCharges", req.body.slurgeCharges, ttlOptions)
        await client.set("slurgeReason", req.body.slurgeReason, ttlOptions)
        await client.set("itemsOnTheWayCost", req.body.itemsOnTheWayCost, ttlOptions)
        await client.set("deliveryPricings", JSON.stringify(req.body.distanceBasePricings))

        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router