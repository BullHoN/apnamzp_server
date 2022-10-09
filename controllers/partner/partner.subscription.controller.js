const client = require('../../util/init_redis')

const defaultSubscriptionBanner = [
    { imageURL: "https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/Untitled-1+(4).png" },
    { imageURL: "https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/Untitled-1+(4).png" }
]

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

    }
}