const express = require('express')
const Order = require('../../models/Order')
const router = express.Router()

router.post('/apna_mzp/admin/order/updateStatus',async (req,res,next)=>{
    const {_id, orderStatus} = req.body; 

    try {

        await Order.findOneAndUpdate({_id: _id},{orderStatus: orderStatus})
        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }

})

module.exports = router