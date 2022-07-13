const express = require('express');
const app = express();
const print = require('./util/printFullObject');
const connectDB = require('./util/dbconfig');
const SearchDB = require('./util/searchbarconfig');
const admin = require("firebase-admin");
const secretFile = require("./firebase_secretkey.json")
const cors = require('cors')
const cloudinary = require('cloudinary').v2;
const morgan = require('morgan')
const compression = require('compression');
const multer  = require('multer')
const AWS = require('aws-sdk')




// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
//     }
//   })
  
// const upload = multer({ storage: storage })
// TODO: USE THE BELOW ONE
const upload = multer()


// Environement variables
require('dotenv').config();

// configure image storage
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// utils
SearchDB.loadData();
require('./util/localDB/localDB')

// configure firebase admin
admin.initializeApp({
    credential: admin.credential.cert(secretFile)
});


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const s3 = new AWS.S3();

// var params = {
//     Bucket: 'process.env.bucketname',
//     Body : 'hello i am vaibhav',
//     Key : 'myfile.txt'
// };

// s3.upload(params,(err,data)=>{
//     if(err) throw err;
//     console.log(data);
// })



app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(morgan('dev'))
app.use(compression());



// mongoDB Connect
connectDB();

// const deliverySathiToken = "f1ezEnWURO61dPnyZlwY5F:APA91bFCWW4K-xT7UUWtXSuXwacO8bXvBCPs8X1qXkEueH6JBwD4jM99naEDjWcBCDnwEAW7EZ6ous8sUp1j6DzJEn7wUBptazYd-yb8VtfGttiUPv83L4a9Q17CuiT5NrXqjPyTVfRc";
const partnerFCMToken = "falPKLFiR-OcK5INVmQaBU:APA91bFQlCwbJEgzaWRipgM2V_OmkoqyHf3KafdIHpg9vhei1P1kVgpKUqexJjQcebm2RzKHBeNcACa7JRC2tPuMlcePZ2lYTIGDWJJKDRdVy4KegWkfq2Dwu19l2qj2ZAlYZYospEXK"
// const userFCMToken = "do3y0UeGTRexGvWfAnbGGK:APA91bGZNs3u0Hg3VTCtQtZO0eIrCp6oq8I0FIyrJN_E3S98MDfIrMAjqTi-mt20wB8BE29VQ3w1PxN-tAzHSsEFUkaJUB746_mMBt92aaAD9Bo19W1Lu7HsDurqhyDPG7CB6h1aZpyu"
// require("./util/sendNotification")(partnerFCMToken,{
//     "data":"zeher",
//     "type": "new_order",
//     "title": "nya order aa gya bhai",
//     "desc": "jake de aa order bhai",
//     "orderId": "6271219c625ead8bbe08e671"
// })

// const Review = require('./models/Review');
// const review = new Review({
//     userName: "Vaibhav Bhardwaj",
//     rating: "1",
//     userMessage: "Good Food ND Service",
//     shopName: "Up63 Cafe"
// }).save();

// test
// const ShopPartner = require('./models/DeliverySathi');
// const shopPartner = new ShopPartner({
//     phoneNo: "1234567890",
//     isVerified: true,
//     password: "vaibhav"
// }).save().then(()=>{
//     console.log("savled");
// }).catch((err)=>{
//     console.log(err);
// })
// const patner = new 

// user app routes
app.use('/',require('./routes/user_app_routes/getCategoryItems'));
app.use('/',require('./routes/user_app_routes/getShopItems'));
app.use('/',require('./routes/user_app_routes/getDistance'));
app.use('/',require('./routes/user_app_routes/getOffers'));
app.use('/',require('./routes/user_app_routes/searchRoute'));
app.use('/',require('./routes/user_app_routes/order/checkoutRoute'));
app.use('/',require('./routes/user_app_routes/getReviews'));
app.use('/',require('./routes/user_app_routes/auth/checkUserExsists'));
app.use('/',require('./routes/user_app_routes/auth/sendOtpRoute'));
app.use('/',require('./routes/user_app_routes/auth/verifyOtp'));
app.use('/',require('./routes/user_app_routes/auth/registerUser'));
app.use('/',require('./routes/user_app_routes/auth/checkPassword'));
app.use('/',require('./routes/user_app_routes/order/getOrders'));
app.use('/',require('./routes/user_app_routes/updateFCMToken'));
app.use('/',require('./routes/user_app_routes/order/getOrder'));
app.use('/',require('./routes/user_app_routes/getCartMetaData'))

// delivery boy routes
app.use('/', require('./routes/delivery_sathi/getDeliveryPricing'));
app.use('/', require('./routes/delivery_sathi/sendLocationUpdates'));
app.use('/', require('./routes/delivery_sathi/getDeliveryOrders'))
app.use('/', require('./routes/delivery_sathi/getDeliverySathiInfo'))
app.use('/', require('./routes/delivery_sathi/updateItemsOnTheWayPrice'));
app.use('/', require('./routes/delivery_sathi/cancelItemsOnTheWay'));
app.use('/', require('./routes/delivery_sathi/getCashInHand'));
app.use('/', require('./routes/delivery_sathi/auth/login'));
app.use('/', require('./routes/delivery_sathi/earnings/getDeliverySathiDayInfo'))

// partner app routes
app.use('/', require('./routes/partner_routes/orders/getOrders'));
app.use('/', require('./routes/partner_routes/orders/updateOrderStatus'));
app.use('/', require('./routes/partner_routes/orders/assignDeliverySathi'));
app.use('/', require('./routes/partner_routes/orders/rejectOrder'));
app.use('/', require('./routes/partner_routes/orders/acceptOrder'));
app.use('/', require('./routes/partner_routes/menu_items/getShopItems'));
app.use('/', require('./routes/partner_routes/menu_items/updateShopItem'));
app.use('/', require('./routes/partner_routes/menu_items/createNewCategory'));
app.use('/', require('./routes/partner_routes/updateShopData'))
app.use('/', require('./routes/partner_routes/auth/login'))
app.use('/', require('./routes/partner_routes/offers/getShopOffers'))
app.use('/', require('./routes/partner_routes/offers/putOffers'))

// app.post('/upload/test',upload.single('item_image'),async (req,res)=>{
//     console.log(req.file);

//     const shopItemData = JSON.parse(req.body.shopItemData);
//     console.log(shopItemData);

//     try{
//         if(req.file){
//             var params = {
//                 Bucket: 'process.env.bucketname',
//                 Body : req.file.buffer,
//                 Key : req.file.originalname
//             };
            
//             const ImageData = await s3.upload(params);
//             console.log(ImageData);
//         }
//     }
//     catch(error){
//         console.log(error);
//     }


//     res.json({
//         success: true
//     })
// })

const sendOtp = require('./routes/user_app_routes/auth/sendOtp');
// sendOtp("9565810009","1234")

app.listen(5000,()=>{
    console.log("Server Running At Port 5000");
})