const express = require('express')
const router = express.Router()
const ShopPartner = require('../../../models/ShopPartner')

router.post('/partner/login',async (req,res)=>{

    const {phoneNo, password} = req.body;

    try {
        // TODO: ignore field password
        const shopPartner = await ShopPartner.findOne({phoneNo});

        if(shopPartner == null){
            res.json({
                success: false,
                desc: "User Not Found"
            })
            return;
        }
    
        if(shopPartner.password == password){
            res.json({
                success: true,
                status: 200,
                data: JSON.stringify(shopPartner)
            })
        }
        else {
            res.json({
                success: false,
                desc: "Incorrect Password"
            })
        }        
    } catch (error) {
        
    }




})

module.exports = router;