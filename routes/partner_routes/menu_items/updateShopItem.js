const express = require('express');
const ShopItem = require('../../../models/ShopItem')
const router = express.Router();
const multer  = require('multer')
const upload = multer()
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

router.post('/partner/update/menuitem',upload.single('item_image'),async (req,res)=>{

    const {shopItemsId, categoryName, isNewItem, deleteItem} = req.query;
    const shopItemData = JSON.parse(req.body.shopItemData);


    try{
        if(req.file){
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body : req.file.buffer,
                Key : req.file.originalname
            };
            
            s3.upload(params,(err,data)=>{
                if(err) throw err;
            });

            shopItemData.imageURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.originalname}`;
        }
        
        const shopItems = await ShopItem.findOne({_id: shopItemsId});
            
        for(let i=0;i<shopItems.categories.length;i++){
            const category = shopItems.categories[i];
            if(category.categoryName == categoryName){
                
                category.isCategoryAvailable = true
                
                if(isNewItem == 'true'){
                    shopItems.categories[i].shopItemDataList = [...shopItems.categories[i].shopItemDataList, shopItemData]
                    await shopItems.save();
                }
                else if(deleteItem == 'true'){
                    shopItems.categories[i].shopItemDataList = shopItems.categories[i].shopItemDataList.filter(_ => _.name != shopItemData.name)
                    await shopItems.save();
                }
                else {
                    for(let j=0;j<category.shopItemDataList.length;j++){
                        const itemName = category.shopItemDataList[j].name;
                        if(itemName == shopItemData.name){
                            shopItems.categories[i].shopItemDataList[j] = shopItemData;
                            
                            await shopItems.save();
                            break;
                        }
    
                    }
                }

                break;
            }

        }

        
        res.json({
            success: true
        })

    }
    catch(error){
        next(error)
    }

})

// router.post('/partner/update/menuitem',async (req,res)=>{

//     const {shopItemsId, categoryName, isNewItem} = req.query;
//     const shopItemData = req.body; 

//     console.log(shopItemsId, categoryName, isNewItem);
//     console.log(shopItemData);

//     try {
//         const shopItems = await ShopItem.findOne({_id: shopItemsId});
            
//         for(let i=0;i<shopItems.categories.length;i++){
//             const category = shopItems.categories[i];
//             if(category.categoryName == categoryName){

//                 if(isNewItem == 'true'){
//                     shopItems.categories[i].shopItemDataList = [...shopItems.categories[i].shopItemDataList, shopItemData]
//                     await shopItems.save();
//                 }
//                 else {
//                     for(let j=0;j<category.shopItemDataList.length;j++){
//                         const itemName = category.shopItemDataList[j].name;
//                         if(itemName == shopItemData.name){
//                             shopItems.categories[i].shopItemDataList[j] = shopItemData;
    
//                             await shopItems.save();
//                             break;
//                         }
    
//                     }
//                 }

//                 break;
//             }

//         }

//         res.json({
//             success: true
//         })

//     } catch (error) {
//         console.log(error);
//     }
// });

module.exports = router;