const express = require('express');
const ShopItem = require('../../models/ShopItem');
const router = express.Router();


router.get('/getShopItems/:itemsId',async (req,res,next)=>{

    try{
        const data = await ShopItem.findOne({_id: req.params.itemsId})
        res.json(sortShopItems(data["categories"]));
    }
    catch(error){
        next(error)
    }

})


function sortShopItems(categories){
    let filteredAvailableCategories = []
    let filteredUnAvailableCategories = []

    categories.forEach((category)=>{
        let currAvailableCategoryItems = []
        let currUnAvailableCategoryItems = []

        category.shopItemDataList.forEach(item => {
            if(item.available) currAvailableCategoryItems.push(item)
            else currUnAvailableCategoryItems.push(item)
        })

        let currCategory = category
        currCategory.shopItemDataList = currAvailableCategoryItems.concat(currUnAvailableCategoryItems)

        if(category.isCategoryAvailable) filteredAvailableCategories.push(currCategory)
        else filteredUnAvailableCategories.push(currCategory)
    })

    return filteredAvailableCategories.concat(filteredUnAvailableCategories);
}


module.exports = router;