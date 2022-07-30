const express = require('express')
const client = require('../../util/init_redis')
const router = express.Router()

const bannerImagesDefault = [{"imageURL": "https://apnamzp-test-bucket.s3.ap-south-1.amazonaws.com/1658316140237_croppedImg.jpg"}]

router.get('/user/bannerImages', async (req,res,next)=>{
    try{
        let bannerImages = await client.get("bannerImages")
        if(bannerImages == null) await client.set("bannerImages",bannerImagesDefault,{
            'EX': 365 * 24 * 60 * 60
        })
        else bannerImages = JSON.parse(bannerImages)

        res.json({
            bannerImages: (bannerImages || bannerImagesDefault)
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router