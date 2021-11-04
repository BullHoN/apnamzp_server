const express = require('express');
const router = express.Router();
const User = require('../../../models/User');


router.get('/login',async (req,res)=>{
    const phoneNo = req.query.phoneNo;
    const password = req.query.password;

    const user = await User.findOne({phoneNo: phoneNo});

    if(user == null){
        res.sendStatus(404);
        return;
    }

    if(user.password == password){
        res.json(true);
    }
    else {
        res.json(false);
    }

})


module.exports = router;
