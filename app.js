const express = require('express');
const app = express();
const print = require('./util/printFullObject');
const connectDB = require('./util/dbconfig');
const SearchDB = require('./util/searchbarconfig');
const cors = require('cors')
SearchDB.loadData();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
require('dotenv').config();

// mongoDB Connect
connectDB();

// const Review = require('./models/Review');
// const review = new Review({
//     userName: "Vaibhav Bhardwaj",
//     rating: "1",
//     userMessage: "Good Food ND Service",
//     shopName: "Up63 Cafe"
// }).save();


// routes
app.use('/',require('./routes/user_app_routes/getCategoryItems'));
app.use('/',require('./routes/user_app_routes/getShopItems'));
app.use('/',require('./routes/user_app_routes/getDistance'));
app.use('/',require('./routes/user_app_routes/getOffers'));
app.use('/',require('./routes/delivery_sathi/getDeliveryPricing'));
app.use('/',require('./routes/user_app_routes/searchRoute'));
app.use('/',require('./routes/user_app_routes/order/checkoutRoute'));
app.use('/',require('./routes/user_app_routes/getReviews'));
app.use('/',require('./routes/user_app_routes/auth/checkUserExsists'));
app.use('/',require('./routes/user_app_routes/auth/sendOtpRoute'));
app.use('/',require('./routes/user_app_routes/auth/verifyOtp'));
app.use('/',require('./routes/user_app_routes/auth/registerUser'));
app.use('/',require('./routes/user_app_routes/auth/checkPassword'));
app.use('/',require('./routes/user_app_routes/order/getOrders'))



app.listen(5000,()=>{
    console.log("Server Running At Port 5000");
})