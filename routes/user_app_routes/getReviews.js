const express = require('express');
const router = express.Router();
const Review = require('../../models/Review')

router.get('/reviews',async (req,res,next)=>{
    const shopName = req.query.shopName;

    try{
        // TODO: add shop name
        const reviews = await Review.find();
        res.json(reviews);
    }
    catch(error){
        next(error)
    }

})


module.exports = router;