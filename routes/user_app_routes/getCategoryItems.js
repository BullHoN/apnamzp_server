const express = require('express');
const Shop = require('../../models/Shop');
const router = express.Router();


router.get('/category/:shopType',async (req,res,next)=>{

    try{
        if(req.params.shopType == "all"){
            const data =  await Shop.find({showShop: true})
                .sort({isOpen: 1,averageRatings: -1});
            res.json(data);
        }
        else {
            const data =  await Shop.find({shopType: req.params.shopType,showShop: true})
                .sort({isOpen: -1,averageRatings: -1});
            res.json(data);
        }
    }
    catch(error){
        next(error)
    }

})


module.exports = router;