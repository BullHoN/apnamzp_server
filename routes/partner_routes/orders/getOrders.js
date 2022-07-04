const express = require('express');
const Order = require('../../../models/Order');
const router = express.Router();

router.get('/partner/getOrders',async (req,res,next)=>{

    try {
        const {shopId, shopCategory, orderStatus, pageNumber, pageSize} = req.query;
        // TODO: Change this
        const orders = await Order.find({shopCategory: shopCategory, shopId: shopId, orderStatus: Number.parseInt(orderStatus)})
            .sort({ created_at: 1 });
        res.json(orders);
    }
    catch(error){
        next(error);
    }

})

module.exports = router;
