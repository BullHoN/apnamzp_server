const cron = require('node-cron')
const Subscription = require('../models/Subscription')
const sendNotificationById = require('../util/sendNotification')
const sendNotificationByTopic = require('../util/sendNotificationOnTopic')
const ShopPartner = require('../models/ShopPartner')
const dateFns = require('date-fns')

function startSubscriptionSchedular(){
    console.log('Subscription Schedular Running...')

    cron.schedule('0 10 * * *', cronJOB)
}

async function cronJOB(){
    const subscriptions = await Subscription.find({isActive: true})

    for(let i=0; i < subscriptions.length; i++){
        const subscription = subscriptions[i]
        const user = await ShopPartner.findOne({shopId: subscription.shopId})

        const daysLeft = dateFns.differenceInDays(subscription.endDate,(new Date())) + 1
        console.log("Days Left ", daysLeft, user.name)

        // 1 day left
        if(daysLeft == 1 && dateFns.compareAsc(subscription.endDate,(new Date())) > 0){

            if(subscription.isFree){

                sendNotificationById(user.fcmId,{
                    type: "subscription",
                    title: "Your Free Trial Will Expire Tomorrow",
                    desc: "For Any Futher Query And Calrifications Contact Apna MZP",
                    data: "sdgsdgsdgsdg"
                })
    
                sendNotificationByTopic("apnamzp_admin", {
                    "type": "subscription",
                    "title": `Free Trial of Shop ${user.name} will expire Tomorrow`,
                    "desc": `Free Trial of Shop ${user.name} wiil expire Tomorrow`,
                    "data": "review_received"
                })
            }
            else {
                sendNotificationById(user.fcmId,{
                    type: "subscription",
                    title: "Your Subscription Will Expire Tomorrow",
                    desc: "For Any Futher Query And Calrifications Contact Apna MZP",
                    data: "sdgsdgsdgsdg"
                })
    
                sendNotificationByTopic("apnamzp_admin", {
                    "type": "subscription",
                    "title": `Subscription of Shop ${user.name} will expire Tomorrow`,
                    "desc": `Subscription of Shop ${user.name} wiil expire Tomorrow`,
                    "data": "review_received"
                })
            }

        }

        // expired
            // free
            // paid
        if(dateFns.compareAsc(subscription.endDate,(new Date())) < 0){
            if(subscription.isFree){

                sendNotificationById(user.fcmId,{
                    type: "subscription",
                    title: "Your Free Trial Has Expired",
                    desc: "Your Plan Has Been Activated Click Here For More Info",
                    data: "sdgsdgsdgsdg"
                })
    
                sendNotificationByTopic("apnamzp_admin", {
                    "type": "subscription",
                    "title": `Free Trial of Shop ${user.name} has Expired`,
                    "desc": `Free Trial of Shop ${user.name} has Expired`,
                    "data": "review_received"
                })
            }
            else {
                sendNotificationById(user.fcmId,{
                    type: "subscription",
                    title: "Your Subscription Has Expired",
                    desc: "Please Pay Now To Continue Your Services",
                    data: "sdgsdgsdgsdg"
                })
    
                sendNotificationByTopic("apnamzp_admin", {
                    "type": "subscription",
                    "title": `Subscription of Shop ${user.name} Has Expired`,
                    "desc": `Subscription of Shop ${user.name} Has Expired`,
                    "data": "review_received"
                })
            }
        }

    }
}


module.exports = startSubscriptionSchedular