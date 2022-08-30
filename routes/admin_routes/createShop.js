const express = require('express')
const ShopPartner = require('../../models/ShopPartner')
const Shop = require('../../models/Shop')
const ShopItem = require('../../models/ShopItem')
const router = express.Router()

router.post('/apna_mzp/admin/createShop', async (req,res,next)=>{
    const { shopName, shopPhoneNumber, shopPassword, shopType, addressData, adminShopService } = req.body

    try{

        const shopItems = await ShopItem.create({
            categories: []
        });

        const shop = await Shop.create({
            name: shopName,
            addressData: addressData,
            menuItemsID: shopItems._id.toString(),
            shopType: shopType,
            phoneNO: shopPhoneNumber,
            adminShopService: adminShopService
        })

        const shopUser = await ShopPartner.create({
            name: shopName,
            phoneNo: shopPhoneNumber,
            password: shopPassword,
            isVerified: true,
            shopType: shopType,
            shopItemsId: shopItems._id.toString(),
            shopId: shop._id.toString()
        })
        
        res.json({
            success: true
        })

    } 
    catch(err){
        next(err)
    }

})

module.exports = router