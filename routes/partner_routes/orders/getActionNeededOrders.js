const express = require('express')
const Order = require('../../../models/Order')
const router = express.Router()

router.get('/partner/actionNeededOrders/:shopId', async (req,res,next)=>{
    try{
        const pendingOrders = await Order.find({shopID: req.params.shopId, orderStatus: 0})
        res.json(pendingOrders)
    }
    catch(err){
        next(err)
    }
})

module.exports = router