const express = require('express')
const router = express.Router()
const DeliverySathi = require('../../models/DeliverySathi')

router.get('/sathi/cashInHand/:deliverySathiId',async (req,res,next)=>{
    const deliverySathiId = req.params.deliverySathiId;

    try {
        console.log(deliverySathiId)
        const deliverySathi = await DeliverySathi.findOne({phoneNo: deliverySathiId})
        res.json({
            cashInHand: deliverySathi.cashInHand
        })
    } catch (error) {
        next(error)
    }

})

module.exports = router;