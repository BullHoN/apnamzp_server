const express = require('express')
const Review = require('../../models/Review')
const Order = require('../../models/Order')
const router = express.Router()

router.post('/user_routes/feedback',async (req,res,next)=>{
    const reviews = req.body;
    try{
        
        let keys = Object.keys(reviews)
        let orderId;

        for(let i=0;i<keys.length;i++){
            const review = new Review(reviews[keys[i]])
            orderId = review.orderId
            await review.save()
        }
        
        await Order.findOneAndUpdate({_id: orderId},{userFeedBack: true});

        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router