const express = require('express')
const Order = require('../../../models/Order')
const DF = require('date-fns')
const totalEarnings = require('./totalEarnings')
const router = express.Router()

router.get('/sathi/dayInfo/:deliverySathi', async (req,res,next)=>{
    const deliverySathi = req.params.deliverySathi
    const { ordersDateString, isMonthly } = req.query

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

    try {

        // TODO: Use this
        const orders = await Order.find({assignedDeliveryBoy: deliverySathi,orderStatus: 6, 
        updated_at: { $gte: greaterThanDate, $lt: lessThanDate }})

        // const orders = await Order.find({orderStatus: 6})
        
        const ordersDeliverySathiData = totalEarnings(orders)
        
        res.json({
            isMonthly: (isMonthly == "true"),
            noOfOrders: orders.length,
            ...ordersDeliverySathiData
        })

    } catch (error) {
        next(error)
    }

})




module.exports = router;