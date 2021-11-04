const express = require('express');
const Shop = require('../../models/Shop');
const router = express.Router();


router.get('/category/:shopType',async (req,res)=>{
    const data =  await Shop.find({shopType: req.params.shopType});
    res.json(data);
})


module.exports = router;