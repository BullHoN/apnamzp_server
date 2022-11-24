const express = require('express')
const Offer = require('../../../models/Offer')
const Shop = require('../../../models/Shop')
const router = express.Router()

router.delete('/partner/offer/:offer_id',async (req,res,next)=>{
    const offerId = req.params.offer_id
    const shopId = req.query.shopId

    try{
        await Offer.deleteOne({_id: offerId});

        Offer.find({shopId}).then(async (offers)=>{
            if(offers.length == 0){
                await Shop.findByIdAndUpdate({_id: shopId},{shopDiscountTag: "0"})
            }
        })

        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})


module.exports = router;