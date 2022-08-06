const express = require('express')
const Order = require('../../../models/Order')
const router = express.Router()

router.post('/apna_mzp/admin/addDeliverySathiIncome',async (req,res,next)=>{
    const { orderId, deliverySathiIncome } = req.query

    try{
        const order = await Order.findOne({_id: orderId})
        console.log(order)
        order.deliverySathiIncome = Number.parseInt(deliverySathiIncome)
        await order.save()

        res.json({
            success: true
        })

    }
    catch(err){
        next(err)
    }
})

module.exports = router