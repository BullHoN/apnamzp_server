const express = require('express');
const ShopItem = require('../../../models/ShopItem');
const router = express.Router();


router.get('/partner/getShopItems/:itemsId',async (req,res,next)=>{

    try{
        const data = await ShopItem.findOne({_id: req.params.itemsId});
        res.json(data["categories"]);
    }
    catch(err){
        next(err)
    }

})


module.exports = router;