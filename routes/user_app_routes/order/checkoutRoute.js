const express = require('express');
const router = express.Router();

router.post('/checkout',(req,res)=>{
    console.log(req.body);
    res.json({});
})


module.exports = router;
