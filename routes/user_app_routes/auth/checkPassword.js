const express = require('express');
const router = express.Router();
const User = require('../../../models/User');
const createError = require('http-errors')
// const ShopPartner = require('../')


// testing login route
router.get('/login',async (req,res,next)=>{

    try {
        const phoneNo = req.query.phoneNo;
        const password = req.query.password;
    
        const user = await User.findOne({phoneNo: phoneNo,__t: null});
    
        if(user == null){
            throw createError.NotFound("User Not Found");
        }
        
        const isMatch = await user.isValidPassword(password);
 
        if(isMatch){
            res.json({
                success: true,
                data: user.name
            });
        }
        else {
            throw createError.Unauthorized("Incorrect Password")
        }

    } catch (error) {
        next(error);
    }

})


module.exports = router;
