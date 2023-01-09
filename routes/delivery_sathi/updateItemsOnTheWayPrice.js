const express = require('express');
const Order = require('../../models/Order')
const sendNotification = require('../../util/sendNotification')
const notificationConstants = require('../../util/notificationConstants')
const User = require('../../models/User')
const router = express.Router();

router.post('/sathi/updateItemsOnTheWayPrice/:orderId',async (req,res,next)=>{
    const orderId = req.params.orderId;
    const itemsOnTheWayActualCost =  Number.parseInt(req.query.itemsOnTheWayActualCost);

    try{
        const order = await Order.findOne({_id: orderId});
        order.billingDetails.itemsOnTheWayActualCost = itemsOnTheWayActualCost;
        order.billingDetails.totalPay = order.billingDetails.totalPay + itemsOnTheWayActualCost;
        await order.save();
        
        // send notification to the user
        const user = await User.findOne({phoneNo: order.userId});
        if(user && user.fcmId){
            sendNotification(user.fcmId,{
                "data": "assdgsdg",
                "type": "order_status_change",
                ...notificationConstants["update_items_on_the_way_price"],
                "orderId": orderId
            })
        }


        res.json({
            success: true
        })
    }
    catch(e){
        next(e)
    }
})

module.exports = router;