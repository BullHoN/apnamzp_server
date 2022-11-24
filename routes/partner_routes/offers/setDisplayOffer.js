const express = require('express')
const router = express.Router()
const Shop = require('../../../models/Shop')

router.post('/partner/offers/set-display-offer', async (req,res,next)=>{
    try{
        const body = req.body;

        const tagMessage = body.offerType == "flat" 
        ? `₹${body.discountAmount} OFF` : `${body.discountPercentage}% OFF`

        await Shop.findOneAndUpdate(
            {_id: body.shopId},
            {shopDiscountTag: tagMessage}
        )

        res.json({
            success: true
        })

    }
    catch(err){
        next(err)
    }
})

module.exports = router