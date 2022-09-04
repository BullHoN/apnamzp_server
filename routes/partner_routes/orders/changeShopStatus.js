const express = require('express')
const Shop = require('../../../models/Shop')
const SearchDB = require('../../../util/searchbarconfig')
const router = express.Router()

router.post('/partner/changeShopStatus',async (req,res,next)=>{
    const { phoneNo, isOpen } = req.query

    console.log(phoneNo, isOpen)
    try{
        const shop = await Shop.findOneAndUpdate({phoneNO: phoneNo},{isOpen: (isOpen == "true")});
        shop.isOpen = (isOpen == "true")
        SearchDB.updateShopStatus(shop)

        res.json({
            success: true
        })
    }
    catch(err){
        next(err);
    }

})

module.exports = router