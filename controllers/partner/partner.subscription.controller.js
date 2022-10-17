const client = require('../../util/init_redis')
const Subscription = require('../../models/Subscription')
const Order = require('../../models/Order')

const defaultSubscriptionBanner = [
    { imageURL: "https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/Untitled-1+(4).png" },
    { imageURL: "https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/Untitled-1+(4).png" }
]

const defaultSubscriptionPricings = [
    { from: 0, to: 15000, amount: 799 },
    { from: 15000, to: 25000, amount: 1499 },
    { from: 25000, to: 35000, amount: 2199 },
    { from: 35000, to: 45000, amount: 2899 }
]

const defaultNewPlanPrice = 299

module.exports = {

    getSubscriptionBanner: async (req,res,next) => {

        try {
            let subscriptionBanners = await client.get("subscriptionBanners")
            if(subscriptionBanners) subscriptionBanners = JSON.parse(subscriptionBanners)
            else await client.set("subscriptionBanners",JSON.stringify(defaultSubscriptionBanner))
            
            res.json(subscriptionBanners || defaultSubscriptionBanner)
        }
        catch(err){
            next(err)
        }

    },

    getActiveSubscription: async (req,res,next) => {
        try {
            const shopId = req.params.shopId
            const subscription = await Subscription.findOne({shopId: shopId, isActive: true})
            
            if(subscription == null){
                res.json({
                    subscriptionPricings: defaultSubscriptionPricings
                })

                return;
            }

            const orders = await Order.find({shopID: shopId, 
                orderStatus: 6, updated_at: { $gte: (new Date(subscription.startDate)), $lte: (new Date(subscription.endDate))}})
            
            let totalEarning = 0
            for(let i=0;i<orders.length;i++){
                totalEarning+= getTotalReceivingAmount(orders[i].billingDetails)
            }

            let subscriptionPricings = await client.get("subscriptionPricings")
            if(subscriptionPricings) subscriptionPricings = JSON.parse(subscriptionPricings)
            else await client.set("subscriptionPricings", JSON.stringify(defaultSubscriptionPricings))

            let newPlanPrice = await client.get("newPlanPrice")
            if(newPlanPrice) newPlanPrice = Number.parseInt(newPlanPrice)
            else await client.set("newPlanPrice", JSON.stringify(defaultNewPlanPrice))

            res.json({
                ...subscription._doc,
                totalEarning: totalEarning,
                subscriptionPricings: subscriptionPricings || defaultSubscriptionPricings,
                newPlanPrice: newPlanPrice || defaultNewPlanPrice
            })

        }
        catch(err){
            next(err)
        }
    },

    getSubscriptionPlans: async (req,res,next) => {
        try {
            let subscriptionPricings = await client.get("subscriptionPricings")
            if(subscriptionPricings) subscriptionPricings = JSON.parse(subscriptionPricings)
            else await client.set("subscriptionPricings", JSON.stringify(defaultSubscriptionPricings))

            res.json(subscriptionPricings || defaultSubscriptionPricings)
        }
        catch(err){
            nexy(err)
        }
    }

    
}

function getTotalReceivingAmount(billingDetails,offerCode){
    let totalReceivingAmount = billingDetails.itemTotal + billingDetails.totalTaxesAndPackingCharge + billingDetails.totalTaxesAndPackingCharge
    if(offerCode != null && offerCode != "" && !offerCode.includes("APNA")){
        totalReceivingAmount -= offerDiscountedAmount
    }

    if(billingDetails.itemTotal >= billingDetails.freeDeliveryPrice){
        totalReceivingAmount -= billingDetails.deliveryCharge
    }

    return totalReceivingAmount
}