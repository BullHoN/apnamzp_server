const express = require('express')
const Order = require('../../../models/Order')
const router = express.Router()

router.post('/apna_mzp/admin/assign_delivery_sathi', async (req,res,next)=>{
    const {orderId, deliverySathi} = req.query

    try{
        const order = await Order.findOne({_id: orderId})
        
    }
    catch(err){
        next(err)
    }
})

module.exports = router