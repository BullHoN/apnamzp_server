const express = require('express');
const router = express.Router();

// TODO: get these from redis
let itemsOnTheWayCost = 10;
let slurgeCharges = 10;
let slurgeReason = "barish hai bhaiya kha se le ay khana aapka";

router.get('/user/cart/metadata',async (req,res,next)=>{

    try{
        res.json({
            itemsOnTheWayCost: itemsOnTheWayCost,
            slurgeCharges: slurgeCharges,
            slurgeReason: slurgeReason
        })
    }
    catch(err){
        next(err)
    }

})

module.exports = router;