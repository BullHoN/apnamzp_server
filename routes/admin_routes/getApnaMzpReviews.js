const express = require('express')
const router = express.Router()
const Review = require('../../models/Review')

router.get('/apna_mzp/admin/apna_reviews',async (req,res,next)=>{
    try{
        const apnaReviews = await Review.find({reviewType: "apna"})
            .sort({ created_at: -1 })
            .limit(30);
        
        res.json(apnaReviews)
    }
    catch(err){
        next(err)
    }
})

module.exports = router