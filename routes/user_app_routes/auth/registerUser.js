const express = require('express');
const router = express.Router();
const User = require('../../../models/User')

router.post('/registerUser',async (req,res,next)=>{
    // Add Some Way to authenticate the token
    const { username, password, phoneNo, name } = req.body;

    try {
        const user = await User.findOne({phoneNo: phoneNo});

        user.name = username;
        user.password = password;
        user.name = name;
        user.isVerified = true;

        await user.save();     
        
        res.json({
            success: true
        })

    } catch (error) {
        next(error)
    }

})


module.exports = router;