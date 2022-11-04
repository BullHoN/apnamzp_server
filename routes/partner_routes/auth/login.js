const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const ShopPartner = require('../../../models/ShopPartner')

router.post('/partner/login',async (req,res,next)=>{

    const {phoneNo, password} = req.body;

    try {
        const shopPartner = await ShopPartner.findOne({phoneNo});

        if(shopPartner == null){
            throw createError.NotFound("Parter Not Found")
        }
    
        if(shopPartner.password == password){
            res.json({
                success: true,
                status: 200,
                data: JSON.stringify(shopPartner)
            })
        }
        else {
            throw createError.Unauthorized("Incorrect Password")
        }        
    } catch (error) {
        next(error)
    }

})

module.exports = router;