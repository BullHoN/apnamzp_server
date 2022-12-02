const express = require('express')
const router = express.Router()
const ShopItem = require('../../../models/ShopItem')

router.post('/partner/turnOffCategory', async (req,res,next)=>{
    try {
        const shopItemId = req.query.shopItemId
        const categoryName = req.query.categoryName

        const shopItems = await ShopItem.findOne({_id: shopItemId})
        shopItems.categories.forEach(_ => {
            if(_.categoryName == categoryName){
                _.isCategoryAvailable = false
                _.shopItemDataList.forEach(__ => {
                    __.available = false
                })
                return;
            }
        })

        await shopItems.save()

        res.json({
            success: true
        })

    }
    catch(err){
        next(err)
    }
})

module.exports = router