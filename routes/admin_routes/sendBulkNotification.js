const express = require('express')
const sendNotificationOnTopic = require('../../util/sendNotificationOnTopic')
const multer  = require('multer')
const upload = multer()
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const router = express.Router()

router.post('/apna_mzp/admin/sendBulkNotification',upload.single('nofication_image'), async (req,res,next)=>{
    try {
        const body = JSON.parse(req.body.notificationData);

        if(req.file){
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : req.file.buffer,
                Key : req.file.originalname
            };
            
            s3.upload(params,(err,data)=>{
                if(err) throw err;

                if(body.shopId){
                    sendNotificationOnTopic(body.targetGroup,{
                        "type": "show_shop",
                        "title": body.title,
                        "desc": body.desc,
                        "shopId": body.shopId,
                        "imageUrl": `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.originalname}`
                    })
                }
                else {
                    sendNotificationOnTopic(body.targetGroup,{
                        "type": "show_shop",
                        "title": body.title,
                        "desc": body.desc,
                        "imageUrl": `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.originalname}`
                    })
                }

            });

        }
        else {

            if(body.shopId){
                sendNotificationOnTopic(body.targetGroup,{
                    "type": "show_shop",
                    "title": body.title,
                    "desc": body.desc,
                    "shopId": body.shopId
                })
            }
            else {
                sendNotificationOnTopic(body.targetGroup,{
                    "type": "show_shop",
                    "title": body.title,
                    "desc": body.desc
                })
            }
            
        }

        res.json({
            success: true 
        })


    }
    catch(err){
        next(err);
    }
})

module.exports = router;