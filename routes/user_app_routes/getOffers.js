const express = require('express');
const router = express.Router();
const Offer = require('../../models/Offer')


router.get('/getOffers',async (req,res,next)=>{
    const isApnaMzpDiscount = req.query.onlyAdmin == "true" ? true : false;
    const allOffers = req.query.allOffers == "true" ? true : false;
    const shopId = req.query.shopId

    try{
        if(allOffers){
            const data = await Offer.find({});
            res.json(data)
        }
        else if(shopId){
            const data = await Offer.find({shopId: shopId});
            res.json(data)
        }
        else if(isApnaMzpDiscount){
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