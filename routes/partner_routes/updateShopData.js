const express = require('express')
const router = express.Router()
const Shop = require('../../models/Shop')
const multer  = require('multer')
const upload = multer()
const AWS = require('aws-sdk');
const s3 = new AWS.S3();


router.post('/partner/update/shopdetails',upload.single('banner_image'),async (req,res)=>{

    const shopData = JSON.parse(req.body.shopData)
    try {

        if(req.file){
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : req.file.buffer,
                Key : req.file.originalname
            };
            
            s3.upload(params,(err,data)=>{
                if(err) throw err;
            });

            shopData.bannerImage = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.originalname}`;            
        }

        await Shop.findOneAndUpdate({_id: shopData.shopId}, shopData)

        res.json({
            success: true
        })        

    } catch (error) {
        next(error)
    }

})

module.exports = router;

