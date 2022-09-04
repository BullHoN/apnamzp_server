const express = require('express')
const Shop = require('../../../models/Shop')
const router = express.Router()

router.post('/apna_mzp/admin/closeAllShops', async (req,res,next) => {
    try{
        await Shop.updateMany({},{isOpen: false})
        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router