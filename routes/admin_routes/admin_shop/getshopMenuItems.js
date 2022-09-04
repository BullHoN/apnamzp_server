const express = require('express')
const router = express.Router()
const ShopItem = require('../../../models/ShopItem')

router.get('/apna_mzp/admin/shopItems/:shopMenuItemsId', async (req,res,next)=>{
    try{
        const shopMenuItems = await ShopItem.findOne({_id: req.params.shopMenuItemsId})

        const flattenedItems = []
        shopMenuItems.categories.forEach((item)=> {
            flattenedItems.push(...item.shopItemDataList)
        })

        res.json(flattenedItems)
    }
    catch(err){
        console.log(err)
        next(err)
    }
})

module.exports = router