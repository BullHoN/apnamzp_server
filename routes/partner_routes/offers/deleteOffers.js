const express = require('express')
const Offer = require('../../../models/Offer')
const router = express.Router()

router.delete('/partner/offer/:offer_id',async (req,res,next)=>{
    const offerId = req.params.offer_id

    try{
        await Offer.deleteOne({_id: offerId});

        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})


module.exports = router;