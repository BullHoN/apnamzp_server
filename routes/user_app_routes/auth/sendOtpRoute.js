const express = require('express');
const sendOtp  = require('./sendOtp');
const User = require('../../../models/User')
const router = express.Router();

router.get('/sendOtp',async (req,res)=>{
    const phoneNo = req.query.phoneNo;
    const user = await User.findOne({phoneNo:phoneNo});
    if(user == null){
        res.sendStatus(404);
        return;
    }
    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    sendOtp(phoneNo,otp);
    
    res.json();
})

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}


module.exports = router;