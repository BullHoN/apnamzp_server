const express = require('express');
const app = express();
const print = require('./util/printFullObject');
const connectDB = require('./util/dbconfig');
const SearchDB = require('./util/searchbarconfig');
const admin = require("firebase-admin");
const secretFile = require("./apnamzp-firebase-adminsdk-q1tsc-cd41009e94.json")
const cors = require('cors')

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
require('dotenv').config();

// mongoDB Connect
connectDB();

// const fcmToken = "dGTkytWJQcel_IVb8zqAVC:APA91bEoi7W0xmedf__jx5wbUBxsEOpeHJ9TTcWGGINY0nK0QLsNITFdW33ezPLqDyx0Dp_hlxQG9IqDRQNRPWPa0wdYfS9IcAxR-gBWATFXubdUPNWasU05UIeyauQLqC23AU9G5Clf"
// require("./util/sendNotification")(fcmToken,{"title": "zeher"})

// const Review = require('./models/Review');
// const review = new Review({
//     userName: "Vaibhav Bhardwaj",
//     rating: "1",
//     userMessage: "Good Food ND Service",
//     shopName: "Up63 Cafe"
// }).save();


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

// delivery boy routes
app.use('/',require('./routes/delivery_sathi/getDeliveryPricing'));
app.use('/',require('./routes/delivery_sathi/sendLocationUpdates'))

// partner app routes
app.use('/', require('./routes/partner_routes/orders/getOrders'));
app.use('/', require('./routes/partner_routes/orders/updateOrderStatus'));
app.use('/', require('./routes/partner_routes/orders/assignDeliverySathi'))


app.listen(5000,()=>{
    console.log("Server Running At Port 5000");
})