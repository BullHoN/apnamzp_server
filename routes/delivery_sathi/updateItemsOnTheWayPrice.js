const express = require('express');
const Order = require('../../models/Order')
const router = express.Router();

router.post('/sathi/updateItemsOnTheWayPrice/:orderId',async (req,res)=>{
    const orderId = req.params.orderId;
    const itemsOnTheWayActualCost =  Number.parseInt(req.query.itemsOnTheWayActualCost);

    try{
        const order = await Order.findOne({_id: orderId});
        order.billingDetails.itemsOnTheWayActualCost = itemsOnTheWayActualCost;
        order.billingDetails.totalPay = order.billingDetails.totalPay + itemsOnTheWayActualCost;
        await order.save();
        
        //TODO send notification to the user

        res.json({
            success: true
        })
    }
    catch(e){

    }
})

module.exports = router;