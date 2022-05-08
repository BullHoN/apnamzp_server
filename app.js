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


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(morgan('dev'))


// mongoDB Connect
connectDB();

// const deliverySathiToken = "f1ezEnWURO61dPnyZlwY5F:APA91bGINq_QWhNrkVHAwnC2PZORP_DvX8sohz8t4PzuCtQaHWNsLdqVlL3PSVTiRUEgSDrwKWfhu4brwpqouDrLiYIOu1Sp3PYOw6GRof-oHeUyc0ra6qRgbTV4vh-eDyReRH9Fhky4";
// const partnerFCMToken = "falPKLFiR-OcK5INVmQaBU:APA91bGrVjYvREJ01pW19kac7xX02cVbQaKflQSjv9QJLbb2GoI2f-dJhNHJ-LjPdAruXT769eX5Fll0GHyY6X38R_64i4ocw91JbyLp8dr28yWev8wCnoAmh0Pp4cdFmo6IsEyNA_X2"
// const userFCMToken = "do3y0UeGTRexGvWfAnbGGK:APA91bGZNs3u0Hg3VTCtQtZO0eIrCp6oq8I0FIyrJN_E3S98MDfIrMAjqTi-mt20wB8BE29VQ3w1PxN-tAzHSsEFUkaJUB746_mMBt92aaAD9Bo19W1Lu7HsDurqhyDPG7CB6h1aZpyu"
// require("./util/sendNotification")(userFCMToken,{
//     "data":"zeher",
//     "type": "order_status_accept",
//     "title": "ha bol diya bhai",
//     "desc": "khana to aa hi jayga",
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
// const ShopPartner = require('./models/ShopPartner');
// const shopPartner = new ShopPartner({
//     phoneNo: "9997403324",
//     isVerified: true,
//     password: "vaibhav",
//     shopId: "6174fea0dbb0b2e38f7de2ad"
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
app.use('/',require('./routes/user_app_routes/order/getOrder'))

// delivery boy routes
app.use('/',require('./routes/delivery_sathi/getDeliveryPricing'));
app.use('/',require('./routes/delivery_sathi/sendLocationUpdates'));
app.use('/',require('./routes/delivery_sathi/getDeliveryOrders'))

// partner app routes
app.use('/', require('./routes/partner_routes/orders/getOrders'));
app.use('/', require('./routes/partner_routes/orders/updateOrderStatus'));
app.use('/', require('./routes/partner_routes/orders/assignDeliverySathi'));
app.use('/',require('./routes/partner_routes/orders/rejectOrder'));
app.use('/',require('./routes/partner_routes/orders/acceptOrder'));

app.listen(5000,()=>{
    console.log("Server Running At Port 5000");
})