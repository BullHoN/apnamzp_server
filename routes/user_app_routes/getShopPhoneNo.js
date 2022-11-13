const express = require('express')
const router = express.Router()
const ShopPartner = require('../../models/ShopPartner')
const httpErrors = require('http-errors')

router.get('/user/shop-data/:shopId', async (req,res,next) =>{

    const shopId = req.params.shopId
    
    try {
        const shopPartner = await ShopPartner.findOne({shopId: shopId})

        if(!shopPartner){
            throw httpErrors.BadRequest("Shop Not Found")
        }

        res.json({
            phoneNo: shopPartner.phoneNo
        })

    }
    catch(err){
        next(err)
    }
})

module.exports = router