const express = require('express')
const router = express.Router()
const DeliverySathi = require('../../../models/DeliverySathi')

router.post('/apna_mzp/admin/update-delivery-sathi', async (req,res,next)=>{
    try {
        const deliverySathi = req.body;
        
        await DeliverySathi.findOneAndUpdate(
            {phoneNo: deliverySathi.phoneNo},
            {$set:{
                currOrders: deliverySathi.currOrders,
                cashInHand: deliverySathi.cashInHand
            }}
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