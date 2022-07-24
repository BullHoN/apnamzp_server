const express = require('express')
const Order = require('../../../models/Order')
const router = express.Router()

router.post('/sathi/acceptOrder',async (req,res,next)=>{
    const { orderId, deliverySathiNo } = req.query
    try{
        const order = await Order.findOne({_id: orderId});
        order.orderAcceptedByDeliverySathi = true
        await order.save()

        res.json({
            success: true
        })

        // send notification to user
    }
    catch(err){
        next(err)
    }
})

module.exports = router;