const express = require('express')
const Review = require('../../models/Review')
const Order = require('../../models/Order')
const Shop = require('../../models/Shop')
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

        const shop = await Shop.findOne({_id: order.shopID})
        let noReviews = Number.parseInt(shop.reviews) + 1
        const newRatingNo = Number.parseFloat(reviews.foodReview.rating)
        const newRating = shop.averageRatings * ((noReviews-1)/noReviews) + newRatingNo * (1 / noReviews)

        shop.averageRatings = newRating.toPrecision(2);
        shop.reviews = `${noReviews}`

        await shop.save()


        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router