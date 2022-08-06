const express = require('express')
const Order = require('../../../models/Order')
const sendNotification = require('../../../util/sendNotification')
const DeliverySathi = require('../../../models/DeliverySathi')
const User = require('../../../models/User')
const router = express.Router()

router.post('/sathi/acceptOrder',async (req,res,next)=>{
    const { orderId, deliverySathiNo } = req.query
    try{
        const order = await Order.findOne({_id: orderId});
        order.orderAcceptedByDeliverySathi = true

        // calculate total income
        if(order.deliverySathiIncome == 0) 
            order.deliverySathiIncome = getTotalIncome(order)

        await order.save()

        // const deliverySathi = await DeliverySathi.findOne({phoneNo: deliverySathiNo})
        const user = await User.findOne({phoneNo: order.userId})

        
        sendNotification(user.fcmId,{
            "data": "assdgsdg",
            "type": "order_status_change",
            "title": "Delivery Sathi Assigned",
            "desc": "Your Delivery Sathi is assigned",
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
    const actutalDistace = Number.parseInt(order.actualDistance)
    if(actutalDistace <= 2){
        return 15;
    }
    else if(actutalDistace <= 4){
        return 20;
    }
    else {
        return 50;
    }
}

module.exports = router;