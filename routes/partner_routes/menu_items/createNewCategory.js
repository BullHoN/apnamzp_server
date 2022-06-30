const express =  require('express');
const ShopItems = require('../../../models/ShopItem')
const router = express.Router();

router.post('/partner/createNewCategory',async (req,res)=>{
    const {shopItemsId} = req.query;
    const newCategory = req.body;

    try {
        const shopItem = await ShopItems.findOne({_id: shopItemsId});
        shopItem.categories = [...shopItem.categories, newCategory];

        await shopItem.save();

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error)
    }

})


module.exports = router;