const express = require('express')
const Order = require('../../../models/Order')
const DF = require('date-fns')
const totalEarnings = require('./totalEarnings')
const router = express.Router()

router.get('/sathi/dayInfo/:deliverySathi', async (req,res)=>{
    const deliverySathi = req.params.deliverySathi
    const { ordersDateString } = req.query

    const greaterThanDate = new Date(ordersDateString)
    const lessThanDate = DF.addDays(greaterThanDate,1)

    try {

        // TODO: Use this
        const orders = await Order.find({assignedDeliveryBoy: deliverySathi,orderStatus: 6, 
        updated_at: { $gte: greaterThanDate, $lt: lessThanDate }})

        // const orders = await Order.find({orderStatus: 6})
        
        const ordersDeliverySathiData = totalEarnings(orders)

        res.json({
            noOfOrders: orders.length,
            ...ordersDeliverySathiData
        })

    } catch (error) {
        
    }

})




module.exports = router;