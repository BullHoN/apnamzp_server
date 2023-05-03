const express = require('express');
const sendOtp = require('./sendOtp');
const createError = require('http-errors');
const User = require('../../../models/User');
const router = express.Router();

router.get('/sendOtp', async (req, res, next) => {
  const phoneNo = req.query.phoneNo;

  if (phoneNo == '1234567890') {
    res.json({
      success: true,
    });
    return;
  }

  try {
    let user = await User.findOne({ phoneNo: phoneNo });
    if (user == null) {
      // throw createError.NotFound("User Not Found");
      user = await User.create({ phoneNo: phoneNo });
    }

    if (user.__t) {
      throw createError.BadRequest(
        'You already have account on our Partner/Sathi App'
      );
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    sendOtp(phoneNo, otp);

    res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

function generateOTP() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

module.exports = router;
