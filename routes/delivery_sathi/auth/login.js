const express = require('express')
const DeliverySathi = require('../../../models/DeliverySathi')
const router = express.Router()

router.post('/sathi/login',async (req,res)=>{
    const {phoneNo, password} = req.body
    try {
        const deliverySathi = await DeliverySathi.findOne({phoneNo: phoneNo, __t: DeliverySathi})
        
        if(deliverySathi == null){
            res.json({
                success: false,
                desc: "Delivery Sathi Not Found"
            })
            return;
        }


        if(deliverySathi.password == password){
            res.json({
                success: true,
                status: 200,
                data: JSON.stringify(deliverySathi)
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