const express = require('express');
const router = express.Router();
const Review = require('../../models/Review')

router.get('/reviews',async (req,res)=>{
    const shopName = req.query.shopName;
    const reviews = await Review.find();

    res.json(reviews);
})


module.exports = router;