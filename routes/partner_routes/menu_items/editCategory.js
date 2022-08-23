const express = require('express')
const ShopItem = require('../../../models/ShopItem')
const router = express.Router()

router.post('/partner/editcategory', async (req,res,next)=>{
    try{
        const { action, categoryName, shopItemsId, newCategoryName } = req.query;

        const shopItem = await ShopItem.findOne({_id: shopItemsId})
        if(action == "edit"){
            shopItem.categories = shopItem.categories.map(_ => {
                if(_.categoryName == categoryName){
                    return {
                        ..._,
                        categoryName: newCategoryName
                    }
                }

                return _;
            })
        }
        else {
            shopItem.categories = shopItem.categories.filter(_ => _.categoryName != categoryName)
        }

        await shopItem.save();

        res.json({
            success: true
        })

    }
    catch(err){
        next(err)
    }
})

module.exports = router