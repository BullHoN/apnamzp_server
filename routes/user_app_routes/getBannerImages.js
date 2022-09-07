const express = require('express')
const client = require('../../util/init_redis')
const router = express.Router()

// const bannerImagesDefault = [
//     {
//         "imageURL":"https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/SECOND+POSTER+(4)+(1).png",
//         "action": "open_shop",
//         "shopId": "6174fea0dbb0b2e38f7de2ad"
//     }
// ]

const bannerImagesDefault = [
    {
        "imageURL":"https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/Untitled-1+(4).png",
    }
]

router.get('/user/bannerImages', async (req,res,next)=>{
    try{
        let bannerImages = await client.get("bannerImages")
        if(bannerImages == null) await client.set("bannerImages",JSON.stringify(bannerImagesDefault),{
            'EX': 365 * 24 * 60 * 60
        })
        else bannerImages = JSON.parse(bannerImages)

        res.json(bannerImages || bannerImagesDefault)
    }
    catch(err){
        next(err)
    }
})

module.exports = router