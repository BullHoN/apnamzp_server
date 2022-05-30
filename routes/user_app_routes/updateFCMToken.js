const express = require('express');
const router = express.Router();
const ShopPartner = require('../../models/ShopPartner');
const User = require('../../models/User');
const DeliverySathi = require('../../models/DeliverySathi')


router.post('/user_routes/updateFCM',async (req,res)=>{
    const body = req.body;
    const type = req.query.user_type;

    if(type == "user"){
        await User.findOneAndUpdate({phoneNo: body.phoneNo},{fcmId: body.fcmId});
    }
    else if(type == "sathi"){
        await DeliverySathi.findOneAndUpdate({phoneNo: body.phoneNo},{fcmId: body.fcmId});
    }
    else{ 
        await ShopPartner.findOneAndUpdate({phoneNo: body.phoneNo},{fcmId: body.fcmId});
    }
    res.sendStatus(200);
});


module.exports = router;