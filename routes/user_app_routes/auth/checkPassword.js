const express = require('express');
const router = express.Router();
const User = require('../../../models/User');
// const ShopPartner = require('../')


// testing login route
router.get('/login',async (req,res)=>{
    const phoneNo = req.query.phoneNo;
    const password = req.query.password;

    // if(user_type == "partner"){

    // }

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
