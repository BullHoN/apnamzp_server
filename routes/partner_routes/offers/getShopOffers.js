const express = require('express');
const Offer = require('../../../models/Offer')
const router = express.Router()

router.get('/partner/offers',async (req,res)=>{
    const {shopName} = req.query;
    try {
        const offers = await Offer.find({shopName}).sort({discountAbove: 1})
        res.json(offers)
    } catch (error) {
        next(error)
    }
})

module.exports = router;