const express = require('express');
const sendOtp  = require('./sendOtp');
const createError = require('http-errors')
const User = require('../../../models/User')
const router = express.Router();

router.get('/sendOtp',async (req,res,next)=>{
    const phoneNo = req.query.phoneNo;

    try{
        const user = await User.findOne({phoneNo:phoneNo});
        if(user == null){
            throw createError.NotFound("User Not Found");
        }
        const otp = generateOTP();
        user.otp = otp;
        await user.save();
    
        sendOtp(phoneNo,otp);

        res.json({
            success: true
        });
    }
    catch(error){
        next(error)
    }

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