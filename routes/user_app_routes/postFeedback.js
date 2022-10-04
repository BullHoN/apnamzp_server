const express = require('express')
const Review = require('../../models/Review')
const Order = require('../../models/Order')
const Shop = require('../../models/Shop')
const sendNotificationByFCM = require('../../util/sendNotification')
const sendNotificationByTopic = require('../../util/sendNotificationOnTopic')
const User = require('../../models/User')
const router = express.Router()

router.post('/user_routes/feedback',async (req,res,next)=>{
    const reviews = req.body;
    try{
        
        let keys = Object.keys(reviews)
        let orderId;

        for(let i=0;i<keys.length;i++){
            if(reviews[keys[i]] == null) continue;
            
            const review = new Review(reviews[keys[i]])
            orderId = review.orderId
            await review.save()
        }
        
        const order = await Order.findOneAndUpdate({_id: orderId},{userFeedBack: true});

        if(reviews.foodReview && reviews.foodReview.rating){
            const shop = await Shop.findOne({_id: order.shopID})
            
            let noReviews = Number.parseInt(shop.reviews) + 1
            const newRatingNo = Number.parseFloat(reviews.foodReview.rating)
            const newRating = shop.averageRatings * ((noReviews-1)/noReviews) + newRatingNo * (1 / noReviews)
    
            shop.averageRatings = newRating.toPrecision(2);
            shop.reviews = `${noReviews}`
    
            await shop.save()

            User.findOne({phoneNo: shop.phoneNO}).then(user => {
                sendNotificationByFCM(user.fcmId, {
                    "type": "review_created",
                    "title": "New Review",
                    "desc": "Your Shop has received a review from customer",
                    "data": "review_received"
                })
            })

        }

        if(reviews.apnaReview && reviews.apnaReview.rating){
            sendNotificationByTopic("apnamzp_admin", {
                "type": "review_created",
                "title": "New Review",
                "desc": "A new review is made by a customer",
                "data": "review_received"
            })
        }

        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router