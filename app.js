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
require('./util/init_redis')
const path = require('path')
const createError = require('http-errors')




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

setInterval(()=>{
    console.log("Loading Data Into Search Bar")
    SearchDB.loadData();
},1000 * 60 * 30)


// require('./util/localDB/localDB')

// configure firebase admin
admin.initializeApp({
    credential: admin.credential.cert(secretFile)
});


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(morgan('dev'))
app.use(compression());



// mongoDB Connect
connectDB();

// const deliverySathiToken = "f1ezEnWURO61dPnyZlwY5F:APA91bFCWW4K-xT7UUWtXSuXwacO8bXvBCPs8X1qXkEueH6JBwD4jM99naEDjWcBCDnwEAW7EZ6ous8sUp1j6DzJEn7wUBptazYd-yb8VtfGttiUPv83L4a9Q17CuiT5NrXqjPyTVfRc";
// const partnerFCMToken = "falPKLFiR-OcK5INVmQaBU:APA91bFQlCwbJEgzaWRipgM2V_OmkoqyHf3KafdIHpg9vhei1P1kVgpKUqexJjQcebm2RzKHBeNcACa7JRC2tPuMlcePZ2lYTIGDWJJKDRdVy4KegWkfq2Dwu19l2qj2ZAlYZYospEXK"
// const userFCMToken = "c9Re1F8nRY64PIwH_7m_Wx:APA91bFJ-WaUDZ5C4NRpDoz5oHjo5DOC6XnHmtvjm-2zfgHyUeU3LGtX_ALCnjCEm00tOnCVLcfrM5-yqs0Did9SCzMAIz4X8IkdqlqtKUN0cQa4RIdRBnZM_M_-Yc3WOho9UmIvtEva"
// require("./util/sendNotification")(userFCMToken,{
//     "data":"zeher",
//     "type": "show_shop",
//     "title": "nya order aa gya bhai",
//     "desc": "jake de aa order bhai",
//     "shopId": "6174fea0dbb0b2e38f7de2ad"
// })


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
app.use('/',require('./routes/user_app_routes/getCartMetaData'));
app.use('/',require('./routes/user_app_routes/getBannerImages'));
app.use('/',require('./routes/user_app_routes/postFeedback'));
app.use('/',require('./routes/user_app_routes/payment/getOrderId'));
app.use('/',require('./routes/user_app_routes/getPickAndDropDetails'))
app.use('/',require('./routes/user_app_routes/getShopData'))

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
app.use('/', require('./routes/delivery_sathi/updateOrderStatusSathi'))
app.use('/', require('./routes/delivery_sathi/orders/acceptOrder'))
app.use('/', require('./routes/delivery_sathi/orders/rejectOrder'))

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
app.use('/', require('./routes/partner_routes/orders/changeShopStatus'))
app.use('/', require('./routes/partner_routes/offers/deleteOffers'))
app.use('/', require('./routes/partner_routes/getShopStatus'))
app.use('/', require('./routes/partner_routes/menu_items/editCategory'))
app.use('/', require('./routes/partner_routes/orders/getActionNeededOrders'))


// admin app routes
app.use('/', require('./routes/admin_routes/admin_shop/getPendingOrders'))
app.use('/', require('./routes/admin_routes/sathi_routes/getAllDeliverySathisInfo'))
app.use('/', require('./routes/admin_routes/sathi_routes/assignDeliverySathi'))
app.use('/', require('./routes/admin_routes/admin_shop/cancelOrder'))
app.use('/', require('./routes/admin_routes/sathi_routes/addDeliverySathiIncome'))
app.use('/', require('./routes/admin_routes/getOrders'))
app.use('/', require('./routes/admin_routes/user_routes/setUserAppData'))
app.use('/', require('./routes/admin_routes/getApnaMzpReviews'))

// app.use(async (req,res,next)=>{
//     next(createError.NotFound("This Route Does Not Exsist"));
// })


// payment test
const generateToken = require('./routes/user_app_routes/payment/initOnlinePayment')

app.get('/getToken', async (req,res,next)=>{
    const { orderId } = req.query; 
    const data = await generateToken(orderId);
    console.log(data)
    res.json({
        token: data.body.txnToken
    })
})

const Razorpay = require('razorpay')
const instance = new Razorpay({ key_id: 'rzp_test_yWzsnOXTqAZItl', key_secret: 'QR5dXhIw6BJNhTX9LbFUfzN9' })

app.get('/getOrderIdTest', async (req,res,next)=>{

    var options = {
		amount: 100,  
		currency: "INR",
		receipt: "Up63Cafe_payment_recipt",
		notes:{
		  email: "vaibhavbhardwaaj@gmail.com"
		 }
	};

    try{
        instance.orders.create(options,function(err,order){
            if(err) throw err

            console.log(order)
            res.json(order)
          })

        // res.json({
        //     success: true
        // })

    }
    catch(err){
        next(err)
    }

})

app.get('/verifypayment', async (req,res,next)=>{
    try{

    }
    catch(err){
        next(err)
    }
})


app.get('/privacy_policy', async (req,res,next)=>{
    res.sendFile(path.resolve(__dirname,'./views/privacyPolicy.html'))
})

// global error handler
app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.json({
        success: false,
        status: (err.status || 500),
        desc: (err.desc || err.message || "Something went wrong"),
        data: err.data
    })
})


app.listen(process.env.PORT,()=>{
    console.log(`Server Running At Port ${process.env.PORT}`);
})