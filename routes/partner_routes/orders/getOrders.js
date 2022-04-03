const express = require('express');
const Order = require('../../../models/Order');
const router = express.Router();

router.get('/partner/getOrders',async (req,res)=>{
    const {shopId, shopCategory, orderStatus, pageNumber} = req.query;

    const orders = await Order.find({shopCategory: shopCategory, shopId: shopId, orderStatus: Number.parseInt(orderStatus)});
    res.json(orders);
})

module.exports = router;
