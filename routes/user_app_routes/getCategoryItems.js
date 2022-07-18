const express = require('express');
const Shop = require('../../models/Shop');
const router = express.Router();


router.get('/category/:shopType',async (req,res,next)=>{

    try{
        const data =  await Shop.find({shopType: req.params.shopType});
        res.json(data);
    }
    catch(error){
        next(error)
    }

})


module.exports = router;