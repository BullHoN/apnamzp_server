const Razorpay = require('razorpay')
const instance = new Razorpay(
    { key_id: process.env.RAZOR_PAY_KEY, key_secret: process.env.RAZOR_PAY_SECRET }
)
const Subscription = require('../../models/Subscription')
const sendNotificationByTopic = require('../../util/sendNotificationOnTopic')
const dateFns = require('date-fns')
const ShopPartner = require('../../models/ShopPartner')

module.exports = {

    getSubscriptionPaymentId: async (req,res,next) => {
        try {

            const body = req.body

            var options = {
                amount: body.amount * 100,  
                currency: "INR",
                receipt: "Subscription_payment_recipt",
                notes:{
                  shopId: body.shopId
                 }
            };

            instance.orders.create(options,function(err,order){
                if(err) throw err
                
                console.log(order)
                res.json({
                    paymentId: order.id
                })

            })

        }
        catch(err){
            next(err)
        }
    },

    subscriptionCheckout: async (req,res,next) => {
        const body = req.body;

        try {
            const oldSubs = await Subscription.findOneAndUpdate(
                { _id: body._id }, 
                { $set: { paymentId: body.paymentId, payedAmount: body.amount, isActive: false} }
            )
            
            if(body.createNewPlan){
                const newSubs = await Subscription.create({
                    shopId: oldSubs.shopId,
                    startDate: dateFns.addDays(oldSubs.endDate,1),
                    endDate: dateFns.addDays(oldSubs.endDate,31)
                })       
                
                ShopPartner.findOne({shopId: oldSubs.shopId}).then((user) => {
                    sendNotificationByTopic("apnamzp_admin", {
                        "type": "subscription",
                        "title": `New Plan Created for ${user.name} !!`,
                        "desc": `Payment Received By ${user.name} And New Plan Is Created`,
                        "data": "review_received"
                    })
                })

            }
            else {
                ShopPartner.findOne({shopId: oldSubs.shopId}).then((user) => {
                    sendNotificationByTopic("apnamzp_admin", {
                        "type": "subscription",
                        "title": `${user.name} Has Discontinued Our Services`,
                        "desc": `Payment Received By ${user.name} But New Plan Is Not Created`,
                        "data": "review_received"
                    })
                })
            }


            res.json({
                success: true
            })

        }
        catch(err){
            next(err)
        }

    }

}