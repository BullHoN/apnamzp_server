const express = require('express');
const Order = require('../../models/Order')
const router = express.Router();

router.get('/sathi/orders/:delivery_sathi',async (req,res)=>{
    const delivery_sathi = req.params.delivery_sathi;
    const orders = await Order.find({assignedDeliveryBoy: delivery_sathi});

    res.json(orders);
})


module.exports = router;