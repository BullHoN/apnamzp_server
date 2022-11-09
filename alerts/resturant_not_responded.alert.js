const sendNotificationByTopic = require('../util/sendNotificationOnTopic')
const Order = require('../models/Order')

function resturantNotRespondedAlert(orderId){
    setTimeout(async ()=>{

    const order = await Order.findOne({_id: orderId})
    
    if(order.orderStatus != 0){
        return;
    }

    console.log("alert for shop not responded")

    if(order.adminShopService){
        sendNotificationByTopic("apnamzp_admin", {
            "type": "order_alerts",
            "title": `Stall Order Delivery Sathi Not Responded`,
            "desc": `Order Id ${orderId}`,
            "data": "shop_not_responded"
        })
    }
    else {
        sendNotificationByTopic("apnamzp_admin", {
            "type": "order_alerts",
            "title": `Normal Order Shop Didn't Responded Alert`,
            "desc": `Order Id ${orderId}`,
            "data": "shop_not_responded"
        })
    }

    },1000 * 60 * 2)
}

module.exports =  resturantNotRespondedAlert