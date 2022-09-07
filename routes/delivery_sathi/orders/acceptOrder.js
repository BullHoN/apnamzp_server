const express = require('express')
const Order = require('../../../models/Order')
const sendNotification = require('../../../util/sendNotification')
const DeliverySathi = require('../../../models/DeliverySathi')
const notificationConstants = require('../../../util/notificationConstants')
const User = require('../../../models/User')
const HttpErrors = require('http-errors')
const router = express.Router()

// TODO: FROM REDIS
const DELIVERY_SATHI_ON_THE_WAY_COST = 4;

router.post('/sathi/acceptOrder',async (req,res,next)=>{
    const { orderId, deliverySathiNo } = req.query
    try{
        const order = await Order.findOne({_id: orderId});

        if(order == null){
            throw HttpErrors.BadRequest("Order Not Found")
        }

        if(order.orderAcceptedByDeliverySathi){
            throw HttpErrors.BadRequest("Order was Already Accepted")
        }

        order.orderAcceptedByDeliverySathi = true

        // calculate total income
        if(order.deliverySathiIncome == 0) 
            order.deliverySathiIncome = getTotalIncome(order)

        if(order.itemsOnTheWay.length > 0){
            order.deliverySathiIncome += (order.itemsOnTheWay.length * DELIVERY_SATHI_ON_THE_WAY_COST)
        }

        await order.save()

        // const deliverySathi = await DeliverySathi.findOne({phoneNo: deliverySathiNo})
        const user = await User.findOne({phoneNo: order.userId})

        
        sendNotification(user.fcmId,{
            "data": "assdgsdg",
            "type": "order_status_change",
            ...notificationConstants["delivery_sathi_assigned"],
            "orderId": orderId
        })

        res.json({
            success: true
        })

    }
    catch(err){
        next(err)
    }
})

function getTotalIncome(order){
    const actutalDistace = Number.parseFloat(order.actualDistance)
    if(actutalDistace <= 3){
        return 20;
    }
    else if(actutalDistace <= 6){
        let amount = 20 + (Math.round(actutalDistace) - 3) * 4
        return amount;
    }
    else {
        let amount = Math.round(actutalDistace) * 8
        return amount
    }
}

module.exports = router;