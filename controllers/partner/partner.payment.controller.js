const Razorpay = require('razorpay')
const instance = new Razorpay(
    { key_id: process.env.RAZOR_PAY_KEY, key_secret: process.env.RAZOR_PAY_SECRET }
)
const Subscription = require('../../models/Subscription')
const dateFns = require('date-fns')

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
            
            const newSubs = await Subscription.create({
                shopId: oldSubs.shopId,
                startDate: dateFns.addDays(oldSubs.startDate,1),
                endDate: dateFns.addDays(oldSubs.startDate,31)
            })

            res.json({
                success: true
            })

        }
        catch(err){
            next(err)
        }

    }

}