const express = require('express')
const Shop = require('../../models/Shop')
const router = express.Router()

router.get('/partner/shopStatus/:id', async (req,res,next)=>{
    try{
        const shop = await Shop.findOne({_id: req.params.id});
        res.json(shop);
    }
    catch(err){
        next(err)
    }
})

module.exports = router