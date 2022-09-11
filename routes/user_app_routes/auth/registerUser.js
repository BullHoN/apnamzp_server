const express = require('express');
const router = express.Router();
const HttpErrors = require('http-errors')
const User = require('../../../models/User')

router.post('/registerUser',async (req,res,next)=>{
    // Add Some Way to authenticate the token
    const { username, password, phoneNo, name } = req.body;

    try {
        const user = await User.findOne({phoneNo: phoneNo});

        if(user.__t){
            throw HttpErrors.BadRequest("You already have account on our Partner/Sathi App")
        }

        user.name = username;
        user.password = password;
        const hashedPassword = await user.encryptPassword(password)
        user.password = hashedPassword

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