const express = require('express')
const Razorpay = require('razorpay')
const instance = new Razorpay(
    { key_id: process.env.RAZOR_PAY_KEY, key_secret: process.env.RAZOR_PAY_SECRET }
)
const router = express.Router()

router.post('/user/getOrderId',async (req,res,next)=>{

    try{
        var options = {
            amount: req.body.amount,  
            currency: "INR",
            receipt: "Up63Cafe_payment_recipt",
            payment_capture: 1,
            notes:{
              email: req.body.userPhoneNo
             }
        };
    
        try{
            instance.orders.create(options,function(err,order){
                if(err) throw err
    
                res.json({
                    paymentId: order.id
                })
              })
    
        }
        catch(err){
            next(err)
        }        
    }
    catch(err){
        next(err)
    }
})

module.exports = router