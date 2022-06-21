const express = require('express');
const router = express.Router();

const itemsOnTheWayCost = 10;

router.get('/user/cart/metadata',(req,res)=>{
    res.json({
        itemsOnTheWayCost
    })
})

module.exports = router;