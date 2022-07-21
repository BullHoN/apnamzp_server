const express = require('express')
const Offer = require('../../../models/Offer')
const router = express.Router()

router.post('/partner/offers', async (req,res,next)=>{
    const offerItem = req.body;
    try {
       
        if(offerItem._id == null){
            const offer = new Offer(offerItem);
            await offer.save();
        }
        else {
            await Offer.findOneAndUpdate({_id: offerItem._id},offerItem)
        }

        res.json({
            success: true
        })

    } catch (error) {
        next(error)
    }
})

module.exports = router