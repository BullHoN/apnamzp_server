const express = require('express')
const client = require('../../../util/init_redis')
const multer  = require('multer')
const upload = multer()
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const router = express.Router()

router.post('/apna_mzp/admin/bannerImages',upload.single('banner_image'), async (req,res,next)=>{
    try {

        let bannerImages = await client.get("bannerImages")
        if(bannerImages == null) bannerImages = []
        else bannerImages = JSON.parse(bannerImages)
        
        const body = JSON.parse(req.body.bannerData)
        const { action } = req.query

        if(action == "del"){
            bannerImages = bannerImages.filter(_ => _.imageURL != body.imageURL)
            await client.set("bannerImages",JSON.stringify(bannerImages))
            res.json({
                success: true
            })
            return;
        }

        if(req.file){
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : req.file.buffer,
                Key : req.file.originalname
            };
            
            s3.upload(params,(err,data)=>{
                if(err) throw err;
            });

            body.newImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.originalname}`;            
        }
        else {
            body.newImageUrl = body.imageURL
        }


        if(body.imageURL == null){ // new banner image
            body.imageURL = body.newImageUrl
            bannerImages.push(body)
        }
        else {     // exsisting banner image
            bannerImages = bannerImages.filter(_ => _.imageURL != body.imageURL)
            body.imageURL = body.newImageUrl
            bannerImages.push(body) 
        }

        await client.set("bannerImages",JSON.stringify(bannerImages))


        res.json({
            success: true
        })


    }
    catch(err){
        next(err);
    }
})

module.exports = router