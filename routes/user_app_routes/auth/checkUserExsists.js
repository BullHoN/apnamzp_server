const express = require('express');
const User = require('../../../models/User');
const sendOtp = require('./sendOtp')
const router = express.Router();

router.get('/checkUserExists',async (req,res,next)=>{
    const phoneNo = req.query.phoneNo;
    const user = await User.findOne({phoneNo: phoneNo});

    try {
        if(user == null){
            const otp = generateOTP();
            const newUser = await (new User({phoneNo: phoneNo,otp:otp}).save());    
            sendOtp(phoneNo,otp);
    
            res.json({
                success: false
            });
        }
        else {
            if(!user.isVerified){
                const otp = generateOTP();
                user.otp = otp;
                await user.save();
            
                sendOtp(phoneNo,otp);
                res.json({
                    success: true
                });
                return;
            }

            res.json({
                success: true
            });
        }        
    } catch (error) {
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