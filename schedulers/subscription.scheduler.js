const cron = require('node-cron')
const Subscription = require('../models/Subscription')
const sendNotificationById = require('../util/sendNotification')
const sendNotificationByTopic = require('../util/sendNotificationOnTopic')

function startSubscriptionSchedular(){
    console.log('running schedular')
    cron.schedule('13 16 * * *', ()=>{
        console.log('hello I am cron job')
    })
}

module.exports = startSubscriptionSchedular