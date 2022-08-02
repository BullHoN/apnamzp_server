const express = require('express')
const Razorpay = require('razorpay')
const instance = new Razorpay({ key_id: 'rzp_test_yWzsnOXTqAZItl', key_secret: 'QR5dXhIw6BJNhTX9LbFUfzN9' })
const router = express.Router()

router.post('/user/getOrderId',async (req,res,next)=>{

    try{
        var options = {
            amount: req.body.amount,  
            currency: "INR",
            receipt: "Up63Cafe_payment_recipt",
            notes:{
              email: req.body.userPhoneNo
             }
        };
    
        try{
            instance.orders.create(options,function(err,order){
                if(err) throw err
    
                console.log(order)
                res.json(order)
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