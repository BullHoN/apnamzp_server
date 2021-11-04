const express = require('express');
const router = express.Router();
const User = require('../../../models/User')

router.post('/registerUser',async (req,res)=>{
    // Add Some Way to authenticate the token
    const { username, password, phoneNo } = req.body;

    const user = await User.findOne({phoneNo: phoneNo});

    user.name = username;
    user.password = password;
    user.isVerified = true;
    user.save();

    res.json(true);
})


module.exports = router;