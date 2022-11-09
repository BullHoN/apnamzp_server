const sendNotificationByTopic = require('../util/sendNotificationOnTopic')
const Order = require('../models/Order')
const ShopPartner = require('../models/ShopPartner')

function delayDeliveryAlert(orderId,preperationTime){

    let timeOutDelay = (Number.parseInt(preperationTime.split('m')[0]) + 15) * 60 * 1000

    setTimeout(async () =>{

        const order = await Order.findOne({_id: orderId})
        const shopPartner = await ShopPartner.findOne({shopId: order.shopID})

        if(order.orderStatus >= 6){
            return
        }

        console.log("Total Time Excded")

        if(order.adminShopService){
            sendNotificationByTopic("apnamzp_admin", {
                "type": "order_alerts_delivery_delay",
                "title": `Stall Order: Total Delivery Time is Exceded`,
                "desc": `Shop Name: ${shopPartner.name} \nOrder Id ${orderId}`,
                "orderId": `${orderId}`,
                "data": "shop_not_responded"
            })
        }
        else {
            sendNotificationByTopic("apnamzp_admin", {
                "type": "order_alerts_delivery_delay",
                "title": `Normal Order: Total Delivery Time is Exceded`,
                "desc": `Shop Name: ${shopPartner.name} \nOrder Id ${orderId}`,
                "orderId": `${orderId}`,
                "data": "shop_not_responded"
            })
        }


    },timeOutDelay)
}

module.exports = delayDeliveryAlert