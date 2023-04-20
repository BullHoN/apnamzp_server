const express = require('express');
const router = express.Router();
const HttpErrors = require('http-errors');
const User = require('../../../models/User');

router.post('/registerUser', async (req, res, next) => {
  // Add Some Way to authenticate the token
  const { username, password, phoneNo, name } = req.body;
  const { invitedBy } = req.query;

  try {
    const user = await User.findOne({ phoneNo: phoneNo });

    if (user.__t) {
      throw HttpErrors.BadRequest(
        'You already have account on our Partner/Sathi App'
      );
    } else if (invitedBy && invitedBy.length > 0) {
      user.invitedBy = invitedBy;
    }

    user.name = username;
    user.name = name;
    user.isVerified = true;

    if (password) {
      user.password = password;
      const hashedPassword = await user.encryptPassword(password);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
