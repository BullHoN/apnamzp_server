const express = require('express')
const DeliverySathi = require('../../../models/DeliverySathi')
const createError = require('http-errors')
const router = express.Router()

router.post('/sathi/login',async (req,res,next)=>{
    const {phoneNo, password} = req.body

    try {
        const deliverySathi = await DeliverySathi.findOne({phoneNo: phoneNo, __t: DeliverySathi})
        
        if(deliverySathi == null){
            throw createError.NotFound("Delivery Sathi Not Found");
        }


        if(deliverySathi.password == password){
            res.json({
                success: true,
                status: 200,
                data: JSON.stringify(deliverySathi)
            })
        }
        else {
            throw createError.Unauthorized("Incorrect Password");
        }

    } catch (error) {
        next(error)
    }
})

module.exports = router;