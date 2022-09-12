const express = require('express')
const client = require('../../util/init_redis')
const Order = require('../../models/Order')
const HttpErrors = require('http-errors')
const router = express.Router()

router.post('/apna_mzp/admin/direct-order', async (req,res,next)=>{
    try {

        const order = await Order.create(req.body);
        
        if(!order){
            throw HttpErrors.BadRequest("Something went wrong");
        }

        let pendingOrders = await client.get("pendingOrders")
        if(pendingOrders == null) pendingOrders = []
        else pendingOrders = JSON.parse(pendingOrders)

        pendingOrders.push(order)

        await client.set("pendingOrders",JSON.stringify(pendingOrders))

        res.json({
            success: true
        })

    }
    catch (err) {
        next(err)
    }
})

module.exports = router