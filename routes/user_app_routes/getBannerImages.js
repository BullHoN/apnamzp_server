const express = require('express')
const client = require('../../util/init_redis')
const router = express.Router()

router.get('/user/bannerImages', async (req,res,next)=>{
    try{
        let bannerImages = await client.get("bannerImages")
        if(bannerImages == null) bannerImages = []
        else bannerImages = JSON.parse(bannerImages)

        res.json(bannerImages)
    }
    catch(err){
        next(err)
    }
})

module.exports = router