const express = require('express');
const ShopItem = require('../../models/ShopItem');
const router = express.Router();
const print = require('../../util/printFullObject')
const mongoose = require('mongoose')


router.get('/getShopItems/:itemsId',async (req,res,next)=>{

    try{

        const data2 = await ShopItem.aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(req.params.itemsId)}
            },
            {
                $unwind: "$categories"
            },
            {
                $sort: {"categories.shopItemDataList.available": -1}
            },
            {
                $group: {_id: "$_id", categories: {$push: "$categories"}}
            }
        ])

        print(data2)

        const data = await ShopItem.findOne({_id: req.params.itemsId})
            .sort({"categories.shopItemDataList.available": -1})

        res.json(data["categories"]);
    }
    catch(error){
        next(error)
    }

})


module.exports = router;