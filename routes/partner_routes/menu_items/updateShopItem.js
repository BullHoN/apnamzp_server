const express = require('express');
const ShopItem = require('../../../models/ShopItem')
const router = express.Router();

router.post('/partner/update/menuitem',async (req,res)=>{

    const {shopItemsId, categoryName} = req.query;
    const shopItemData = req.body; 

    try {
        const shopItems = await ShopItem.findOne({_id: shopItemsId});
        for(let i=0;i<shopItems.categories.length;i++){
            const category = shopItems.categories[i];
            if(category.categoryName == categoryName){

                for(let j=0;j<category.shopItemDataList.length;j++){
                    const itemName = category.shopItemDataList[j].name;
                    if(itemName == shopItemData.name){
                        shopItems.categories[i].shopItemDataList[j] = shopItemData;

                        await shopItems.save();
                        break;
                    }

                }

                break;
            }

        }

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error);
    }
});


module.exports = router;