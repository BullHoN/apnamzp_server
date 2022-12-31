const express = require('express')
const router = express.Router()
const Subscription = require('../../../models/Subscription')

router.post('/apna_mzp/admin/update/subscription', async (req,res,next)=>{
    try {
        const body = req.body
        const subscription = await Subscription.findOneAndUpdate(
            {_id: body._id},
            {startDate: body.startDate,endDate: body.endDate}
        );
        
        res.json({
            success: true
        })

    }
    catch(err){
        next(err)
    }
})

module.exports = router