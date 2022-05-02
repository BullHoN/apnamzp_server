const express = require('express');
const Order = require('../../../models/Order');
const ShopPartner = require('../../../models/ShopPartner');
const Shop = require('../../../models/Shop');
const sendNotification = require('../../../util/sendNotification');
const router = express.Router();


router.post('/checkout',async (req,res)=>{
    // console.log(req.body,"sdgfsdgsdg");
    const order = new Order(req.body);
    order.save();

    // send notification to the shop
    const shopData = await Shop.findOne({_id: req.body.shopID});
    const shopUser = await ShopPartner.findOne({phoneNo: shopData.phoneNO});


    sendNotification(shopUser.fcmId,{
        "orderItems":  JSON.stringify(req.body.orderItems),
        "_id": order._id.toString(),
        "userId": req.body.userId,
        "type": "new_order"
    })

    res.json(true);
})



module.exports = router;
