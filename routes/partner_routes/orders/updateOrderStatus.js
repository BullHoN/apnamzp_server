const express = require('express');
const router = express.Router();
const Order = require('../../../models/Order')

router.post('/partner/order/updateStatus',async (req,res)=>{
    const {orderId, orderStatus} = req.query; 
    await Order.findOneAndUpdate({id: orderId},{orderStatus: orderStatus});
    res.json({status: true});
})


module.exports = router;