const express = require('express');
const DF = require('date-fns')
const Order = require('../../../models/Order');
const httpErrors = require('http-errors')
const router = express.Router();

router.get('/partner/getOrders',async (req,res,next)=>{

    try {
        const {shopId, shopCategory, orderStatus, ordersDateString,  pageNumber, pageSize, isMonthly} = req.query;

        let greaterThanDate;
        let lessThanDate;
    
        if(isMonthly == "true"){
            const curr_year = Number.parseInt(ordersDateString.split('-')[0])
            const curr_month = Number.parseInt(ordersDateString.split('-')[1])
    
            greaterThanDate = new Date(curr_year,curr_month-1)
            greaterThanDate = DF.add(greaterThanDate, {days: 1})
    
            lessThanDate = DF.add(greaterThanDate, {
                months: 1
            })
        }
        else {
            greaterThanDate = new Date(ordersDateString)
            lessThanDate = DF.addDays(greaterThanDate,1)  
        }


        if(Number.parseInt(orderStatus) == 6){
            const orders = await Order.find({shopID: shopId, 
                orderStatus: { $lte: 7, $gte: 6 }, created_at: { $gte: greaterThanDate, $lt: lessThanDate }})
                .sort({ created_at: 1 });

            res.json(orders);
        }
        else {
            const orders = await Order.find({shopID: shopId, 
                orderStatus: Number.parseInt(orderStatus), created_at: { $gte: greaterThanDate, $lt: lessThanDate }})
                .sort({ created_at: 1 });

            res.json(orders);
        }

        console.log(shopId)
        // TODO: Change this


        // const orders = await Order.find({shopCategory: shopCategory, shopId: shopId, 
        //     orderStatus: Number.parseInt(orderStatus)})
        //     .sort({ created_at: 1 });

    }
    catch(error){
        next(error);
    }

})


router.get('/partner/getOrders/:orderId', async (req,res,next) => {
    try {
        const orderId = req.params.orderId

        const order = await Order.findOne({_id: orderId})

        if(order == null){
            throw httpErrors.BadRequest("Order Not Found")
        }

        res.json(order)

    }
    catch(err){
        next(err)
    }
})

module.exports = router;
