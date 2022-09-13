const express = require('express')
const client = require('../../util/init_redis')
const router = express.Router()

router.post('/partner/register-form', async (req,res,next)=>{
    try {
        
        let shopRegistrations = await client.get("shopRegistrations")
        if(shopRegistrations == null) shopRegistrations = []
        else shopRegistrations = JSON.parse(shopRegistrations)
        
        shopRegistrations = [...shopRegistrations, req.body]

        await client.set("shopRegistrations",JSON.stringify(shopRegistrations))

        res.json({
            success: true
        })
    }
    catch (err){
        next(err)
    }
})

module.exports = router;