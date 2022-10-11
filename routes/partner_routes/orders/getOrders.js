const express = require('express');
const DF = require('date-fns')
const Order = require('../../../models/Order');
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

        console.log(shopId)
        // TODO: Change this
        const orders = await Order.find({shopID: shopId, 
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
