const express = require('express');
const DF = require('date-fns')
const Order = require('../../../models/Order');
const router = express.Router();

router.get('/partner/getOrders',async (req,res,next)=>{

    try {
        const {shopId, shopCategory, orderStatus, ordersDateString,  pageNumber, pageSize} = req.query;
        const greaterThanDate = new Date(ordersDateString)
        const lessThanDate = DF.addDays(greaterThanDate,1)


        // TODO: Change this
        const orders = await Order.find({shopCategory: shopCategory, shopId: shopId, 
            orderStatus: Number.parseInt(orderStatus), updated_at: { $gte: greaterThanDate, $lt: lessThanDate }})
            .sort({ created_at: 1 });

        // const orders = await Order.find({shopCategory: shopCategory, shopId: shopId, 
        //     orderStatus: Number.parseInt(orderStatus)})
        //     .sort({ created_at: 1 });

        
        res.json(orders);
    }
    catch(error){
        next(error);
    }

})

module.exports = router;
