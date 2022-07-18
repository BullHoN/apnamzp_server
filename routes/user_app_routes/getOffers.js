const express = require('express');
const router = express.Router();
const Offer = require('../../models/Offer')


router.get('/getOffers',async (req,res,next)=>{
    const isApnaMzpDiscount = req.query.onlyAdmin == "true" ? true : false;

    try{
        if(isApnaMzpDiscount){
            const data = await Offer.find({isApnaMzpDiscount: isApnaMzpDiscount});
            res.json(data);
        }
        else {
            const data = await Offer.find({$or:[{
                isApnaMzpDiscount: true
            },
            {
                shopName: req.query.shopName
            }]});
            res.json(data)
        }
    }
    catch(error){
        next(error)
    }

})

module.exports = router;