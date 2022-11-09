const sendNotificationByTopic = require('../util/sendNotificationOnTopic')
const Order = require('../models/Order')
const ShopPartner = require('../models/ShopPartner')

function resturantNotRespondedAlert(orderId,adminShopService){

    let intervalTime = adminShopService ? 1000 * 60 * 1 : 1000 * 60 * 2

    setTimeout(async ()=>{

    const order = await Order.findOne({_id: orderId})
    const shopPartner = await ShopPartner.findOne({shopId: order.shopID})
    
    if(order.orderStatus != 0){
        return;
    }

    console.log("alert for shop not responded")

    if(order.adminShopService){
        sendNotificationByTopic("apnamzp_admin", {
            "type": "order_alerts_not_responded",
            "title": `Stall Order Delivery Sathi Not Responded`,
            "desc": `Shop Name: ${shopPartner.name} \nOrder Id ${orderId}`,
            "orderId": `${orderId}`,
            "data": "shop_not_responded"
        })
    }
    else {
        sendNotificationByTopic("apnamzp_admin", {
            "type": "order_alerts_not_responded",
            "title": `Shop Name: ${shopPartner.name} \nOrder Id ${orderId}`,
            "desc": `Order Id ${orderId}`,
            "orderId":`${orderId}`,
            "data": "shop_not_responded"
        })
    }

    },intervalTime)
}

module.exports =  resturantNotRespondedAlert