const sendNotificationByTopic = require('../util/sendNotificationOnTopic')
const Order = require('../models/Order')
const ShopPartner = require('../models/ShopPartner')

function delayPreperationTimeAlert(orderId,preperationTime){

    let timeOutDelay = Number.parseInt(preperationTime.split('m')[0]) * 60 * 1000

    setTimeout(async () =>{

        const order = await Order.findOne({_id: orderId})
        const shopPartner = await ShopPartner.findOne({shopId: order.shopID})

        if(order.orderStatus > 2){
            return
        }

        console.log("Preperation Time Exceded")

        if(order.adminShopService){
            sendNotificationByTopic("apnamzp_admin", {
                "type": "order_alerts",
                "title": `Stall Order: Preperation Time Excedded Order Not Updated`,
                "desc": `Shop Name: ${shopPartner.name} \nOrder Id ${orderId}`,
                "orderId": `${orderId}`,
                "data": "shop_not_responded"
            })
        }
        else {
            sendNotificationByTopic("apnamzp_admin", {
                "type": "order_alerts",
                "title": `Normal Order Preperation Time Exceded Order Not Updated`,
                "desc": `Shop Name: ${shopPartner.name} \nOrder Id ${orderId}`,
                "orderId": `${orderId}`,
                "data": "shop_not_responded"
            })
        }


    },timeOutDelay)
}

module.exports = delayPreperationTimeAlert