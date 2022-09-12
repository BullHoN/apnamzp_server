const express = require('express')
const HttpErrors = require('http-errors')
const sendTestNotification = require('../../util/sendNotification')
const sendNotificationOnTopic = require('../../util/sendNotificationOnTopic')
const User = require('../../models/User')
const multer  = require('multer')
const upload = multer()
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const router = express.Router()

router.post('/apna_mzp/admin/sendBulkNotification',upload.single('nofication_image'), async (req,res,next)=>{
    try {
        const body = JSON.parse(req.body.notificationData);
        const testNumber = req.query.test_notification_number

        let user
        if(testNumber){
            user = await User.findOne({phoneNo: testNumber})

            if(!user){
                throw HttpErrors.BadRequest("Bhai Kya kar rha hai tu...")
            }
        }


        if(req.file){
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : req.file.buffer,
                Key : req.file.originalname
            };
            
            s3.upload(params,(err,data)=>{
                if(err) throw err;

                if(body.shopId){

                    if(testNumber){
                        sendTestNotification(user.fcmId,{
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
                            "shopId": body.shopId,
                            "imageUrl": `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.originalname}`
                        })
                    }

                }
                else {
                    if(testNumber){
                        sendTestNotification(user.fcmId,{
                            "type": "show_shop",
                            "title": body.title,
                            "desc": body.desc,
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
                }

            });

        }
        else {

            if(body.shopId){
                if(testNumber){
                    sendTestNotification(user.fcmId,{
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
                        "desc": body.desc,
                        "shopId": body.shopId
                    })
                }

            }
            else {
                if(testNumber){
                    sendTestNotification(user.fcmId,{
                        "type": "show_shop",
                        "title": body.title,
                        "desc": body.desc
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