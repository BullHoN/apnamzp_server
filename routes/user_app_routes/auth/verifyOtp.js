const express = require('express');
const router = express.Router();
const User = require('../../../models/User')

router.get('/verifyOtp',async (req,res)=>{
    const phoneNo = req.query.phoneNo;
    const otp = req.query.otp;

    const user = await User.findOne({phoneNo:phoneNo});
    if(user.otp != otp){
        res.json(false)
    }
    else {
        res.json(true)
    }

})

module.exports = router;