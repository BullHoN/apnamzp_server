const sendNotificationByTopic = require('../util/sendNotificationOnTopic')
const Order = require('../models/Order')

function delayPreperationTimeAlert(orderId,preperationTime){

    let timeOutDelay = Number.parseInt(preperationTime.split('m')[0]) * 60 * 1000

    setTimeout(async () =>{

        const order = await Order.findOne({_id: orderId})

        if(order.orderStatus > 3){
            return
        }

        console.log("Preperation Time Exceded")

        if(order.adminShopService){
            sendNotificationByTopic("apnamzp_admin", {
                "type": "order_alerts",
                "title": `Stall Order: Preperation Time Excedded Order Not Updated`,
                "desc": `Order Id ${orderId}`,
                "data": "shop_not_responded"
            })
        }
        else {
            sendNotificationByTopic("apnamzp_admin", {
                "type": "order_alerts",
                "title": `Normal Order Preperation Time Exceded Order Not Updated`,
                "desc": `Order Id ${orderId}`,
                "data": "shop_not_responded"
            })
        }


    },timeOutDelay)
}

module.exports = delayPreperationTimeAlert