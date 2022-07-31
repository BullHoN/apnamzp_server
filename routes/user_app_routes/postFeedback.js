const express = require('express')
const Review = require('../../models/Review')
const router = express.Router()

router.post('/user_routes/feedback',async (req,res,next)=>{
    const reviews = req.body;
    try{
        
        let keys = Object.keys(reviews)
        for(let i=0;i<keys.length;i++){
            const review = new Review(reviews[keys[i]])
            await review.save()
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