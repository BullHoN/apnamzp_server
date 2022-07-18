const express = require('express');
const router = express.Router();
const User = require('../../../models/User')

router.get('/verifyOtp',async (req,res,next)=>{
    const phoneNo = req.query.phoneNo;
    const otp = req.query.otp;

    try {
        const user = await User.findOne({phoneNo: phoneNo});
        if(user.otp != otp){
            res.json({
                success: false
            })
        }
        else {
            res.json({
                success: true
            })
        }        
    } catch (error) {
        next(error)
    }

})

module.exports = router;