const express = require('express');
const Order = require('../../../models/Order');
const router = express.Router();

router.post('/checkout',(req,res)=>{
    console.log(req.body);
    const order = new Order(req.body).save().then(()=>{
        // TODO: send notification to the shop
        res.json(true);
    })
    .catch((err)=>{
        res.json(false);
    })
    
})


module.exports = router;
