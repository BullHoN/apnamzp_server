const express = require('express')
const Order = require('../../models/Order')
const User = require('../../models/User')
const createError = require('http-errors')
const sendNotification = require('../../util/sendNotification')
const router = express.Router()

router.post('/sathi/order/updateStatus',async (req,res,next)=>{
    const {orderId, orderStatus, shopReceivedPayment} = req.query;

    try{
        const order = await Order.findOne({_id: orderId});

        if(order.orderStatus < 4){
            throw createError.BadRequest("Please wait for shop to proceed");
        }
        else {
            order.orderStatus += 1;
        }

        if(order.itemsOnTheWay.length > 0 && !order.itemsOnTheWayCancelled && order.billingDetails.itemsOnTheWayActualCost == 0){
            throw createError.BadRequest("Please Add The Total For Items On The Way Before Proceding")
        }

        await order.save();

        if(order.orderStatus == 6 && order.billingDetails.isDeliveryService){
            // update the cash in the hand of the deliveyr sathi
            // TODO: update for the thela orders
            const deliverySathi = await User.findOne({phoneNo: order.assignedDeliveryBoy})
            if(order.isPaid){
                let amountPaidToResturant = order.billingDetails.itemTotal + order.billingDetails.totalTaxesAndPackingCharge - order.billingDetails.totalDiscount
                if(order.offerCode != null && order.offerCode != '' && !order.offerCode.includes("APNAMZP")){
                    amountPaidToResturant -= order.billingDetails.offerDiscountedAmount
                }
    
                deliverySathi.cashInHand -= amountPaidToResturant
            }
            else {
                if(order.paymentReceivedToShop){
                    deliverySathi.cashInHand += order.billingDetails.deliveryCharge + order.billingDetails.itemsOnTheWayTotalCost
                }
                else {
                    deliverySathi.cashInHand += order.billingDetails.totalPay
                }
                
            }
    
            deliverySathi.currOrders -= 1;
    
            await deliverySathi.save();
        }

        const user = await User.findOne({phoneNo: order.userId});
        sendNotification(user.fcmId,{
            "data": "assdgsdg",
            "type": "order_status_change",
            "title": "kuch to huaa hai",
            "desc": "kuch ho to rha hai",
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

module.exports = router