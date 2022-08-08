const express = require('express');
const router = express.Router();
const Review = require('../../models/Review')

router.get('/reviews',async (req,res,next)=>{
    const shopId = req.query.shopName;

    try{
        const reviews = await Review.find({shopName: shopId, reviewType: "shop"});
        res.json(reviews);
    }
    catch(error){
        next(error)
    }

})


module.exports = router;