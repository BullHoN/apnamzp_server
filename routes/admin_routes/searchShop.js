const express = require('express')
const Shop = require('../../models/Shop')
const router = express.Router()

router.get('/apna_mzp/admin/search_shop', async (req,res,next)=>{
    try {
        const shops = await Shop.find(
            {name: { $regex : req.query.shopName , $options: "i" }},
            {name: 1, menuItemsID: 1, shopType: 1}
        )
        res.json(shops)
    }
    catch(err){
        next(err)
    }
})

module.exports = router