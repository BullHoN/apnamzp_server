const express = require('express');
const app = express();
const print = require('./util/printFullObject');
const connectDB = require('./util/dbconfig');
const SearchDB = require('./util/searchbarconfig');
const admin = require('firebase-admin');
const secretFile = require('./firebase_secretkey.json');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const morgan = require('morgan');
const compression = require('compression');
const multer = require('multer');
const AWS = require('aws-sdk');
require('./util/init_redis');
const path = require('path');
const createError = require('http-errors');
const subscriptionSchedular = require('./schedulers/subscription.scheduler');
const AllRoutes = require('./routes/main');

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
const upload = multer();

// Environement variables
require('dotenv').config();

// configure image storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// utils

SearchDB.loadData();

setInterval(() => {
  console.log('Loading Data Into Search Bar');
  SearchDB.loadData();
}, 1000 * 60 * 5);

// require('./util/localDB/localDB')

// configure firebase admin
admin.initializeApp({
  credential: admin.credential.cert(secretFile),
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(express.static('views'));

// mongoDB Connect
connectDB();

// subscription schedular
subscriptionSchedular();

// const deliverySathiToken = "f1ezEnWURO61dPnyZlwY5F:APA91bFCWW4K-xT7UUWtXSuXwacO8bXvBCPs8X1qXkEueH6JBwD4jM99naEDjWcBCDnwEAW7EZ6ous8sUp1j6DzJEn7wUBptazYd-yb8VtfGttiUPv83L4a9Q17CuiT5NrXqjPyTVfRc";
// const partnerFCMToken = "cpKuSZDsQ0yzM_vJKjjFKW:APA91bGko5CKirSPMPCmLRQdKrzPBTrAregBXIn4fHWWico_0eQ6MPv-iNIg81CsT4lwggOe1x1YBU8BjlPAPTvCmrFm_cqu7enJzkapkD17GiyaCaDqlnNPD4jFUmT_piqdKAeX0zNe"
// const userFCMToken = "eRUTQH6sRpqaT8huTufgs5:APA91bFechOdZLCsA022Ym4r7T2QI7VJcXGmEd13cm7f3pr2nZQnwgOyQvobwO0DxHVZYFXWRacc2HdtKi5sdoTe3OUltdJOnLBzjcVwB5o6zZPonHkp1FnkzjPBdjNuBg-RcTvbda8P"
// require("./util/sendNotification")(partnerFCMToken,{
//     "type": "subscription",
//     "title": "Your Subscription is Expired",
//     "desc": "Pay Now to Continue Our Services !!",
//     "data": "review_received"
// })

// const user = require('./models/User')
// async function sendNotificationToAllUser(){
//     const users = await user.find({});
//     users.forEach((user)=>{

//         if(!user.fcmId){

//         }

//         const message = {
//             notification: {
//                 title: "Namestey🙏 Mirzapur",
//                 body: "0% Commission ki Duniya Mein Apka Swagat Hai🥳 \nOrder Kare Aur Hmareh Services Ka Labh Uthayeh \nApna Feedback Jarur Share Kareh \nThank You ApnaMzp",
//                 // image: "https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/poster+3.png"
//             },
//             token: user.fcmId,
//             android:{
//                 priority: "high"
//             }
//         }

//         admin.messaging().send(message)
//           .then((response) => {
//             console.log('Successfully sent message to ' + "user", response);
//           })
//           .catch(err => console.log(err))
//     })
// }

// sendNotificationToAllUser()

// all routes import
app.use('/', AllRoutes);

// user app routes
app.use('/', require('./routes/user_app_routes/getCategoryItems'));
app.use('/', require('./routes/user_app_routes/getShopItems'));
app.use('/', require('./routes/user_app_routes/getDistance'));
app.use('/', require('./routes/user_app_routes/getOffers'));
app.use('/', require('./routes/user_app_routes/searchRoute'));
app.use('/', require('./routes/user_app_routes/order/checkoutRoute'));
app.use('/', require('./routes/user_app_routes/getReviews'));
app.use('/', require('./routes/user_app_routes/auth/checkUserExsists'));
app.use('/', require('./routes/user_app_routes/auth/sendOtpRoute'));
app.use('/', require('./routes/user_app_routes/auth/verifyOtp'));
app.use('/', require('./routes/user_app_routes/auth/registerUser'));
app.use('/', require('./routes/user_app_routes/auth/checkPassword'));
app.use('/', require('./routes/user_app_routes/order/getOrders'));
app.use('/', require('./routes/user_app_routes/updateFCMToken'));
app.use('/', require('./routes/user_app_routes/order/getOrder'));
app.use('/', require('./routes/user_app_routes/getCartMetaData'));
app.use('/', require('./routes/user_app_routes/getBannerImages'));
app.use('/', require('./routes/user_app_routes/postFeedback'));
app.use('/', require('./routes/user_app_routes/payment/getOrderId'));
app.use('/', require('./routes/user_app_routes/getPickAndDropDetails'));
app.use('/', require('./routes/user_app_routes/getShopData'));
app.use('/', require('./routes/user_app_routes/getServiceStatus'));
app.use('/', require('./routes/user_app_routes/getShopPhoneNo'));
app.use('/', require('./routes/user_app_routes/getBannerAnimation'));
app.use('/', require('./routes/user_app_routes/getFreeDeliveryOffers'));
app.use('/', require('./routes/user_app_routes/order/createOrder'));
app.use('/', require('./routes/user_app_routes/payment/paymentConfimation'));

// delivery boy routes
app.use('/', require('./routes/delivery_sathi/getDeliveryPricing'));
app.use('/', require('./routes/delivery_sathi/sendLocationUpdates'));
app.use('/', require('./routes/delivery_sathi/getDeliveryOrders'));
app.use('/', require('./routes/delivery_sathi/getDeliverySathiInfo'));
app.use('/', require('./routes/delivery_sathi/updateItemsOnTheWayPrice'));
app.use('/', require('./routes/delivery_sathi/cancelItemsOnTheWay'));
app.use('/', require('./routes/delivery_sathi/getCashInHand'));
app.use('/', require('./routes/delivery_sathi/auth/login'));
app.use(
  '/',
  require('./routes/delivery_sathi/earnings/getDeliverySathiDayInfo')
);
app.use('/', require('./routes/delivery_sathi/updateOrderStatusSathi'));
app.use('/', require('./routes/delivery_sathi/orders/acceptOrder'));
app.use('/', require('./routes/delivery_sathi/orders/rejectOrder'));
app.use('/', require('./routes/delivery_sathi/getNotRespondedOrders'));

// partner app routes
app.use('/', require('./routes/partner_routes/orders/getOrders'));
app.use('/', require('./routes/partner_routes/orders/updateOrderStatus'));
app.use('/', require('./routes/partner_routes/orders/assignDeliverySathi'));
app.use('/', require('./routes/partner_routes/orders/rejectOrder'));
app.use('/', require('./routes/partner_routes/orders/acceptOrder'));
app.use('/', require('./routes/partner_routes/menu_items/getShopItems'));
app.use('/', require('./routes/partner_routes/menu_items/updateShopItem'));
app.use('/', require('./routes/partner_routes/menu_items/createNewCategory'));
app.use('/', require('./routes/partner_routes/updateShopData'));
app.use('/', require('./routes/partner_routes/auth/login'));
app.use('/', require('./routes/partner_routes/offers/getShopOffers'));
app.use('/', require('./routes/partner_routes/offers/putOffers'));
app.use('/', require('./routes/partner_routes/orders/changeShopStatus'));
app.use('/', require('./routes/partner_routes/offers/deleteOffers'));
app.use('/', require('./routes/partner_routes/getShopStatus'));
app.use('/', require('./routes/partner_routes/menu_items/editCategory'));
app.use('/', require('./routes/partner_routes/orders/getActionNeededOrders'));
app.use('/', require('./routes/partner_routes/registerShop'));
app.use(
  '/partner/subscription',
  require('./routes/partner_routes/subscription/router.partner.subscription')
);
app.use(
  '/partner/payment',
  require('./routes/partner_routes/payment/router.partner.payment')
);
app.use('/', require('./routes/partner_routes/offers/setDisplayOffer'));
app.use('/', require('./routes/partner_routes/menu_items/turnOffCategory'));

// admin app routes
app.use('/', require('./routes/admin_routes/admin_shop/getPendingOrders'));
app.use(
  '/',
  require('./routes/admin_routes/sathi_routes/getAllDeliverySathisInfo')
);
app.use('/', require('./routes/admin_routes/sathi_routes/assignDeliverySathi'));
app.use('/', require('./routes/admin_routes/admin_shop/cancelOrder'));
app.use(
  '/',
  require('./routes/admin_routes/sathi_routes/addDeliverySathiIncome')
);
app.use('/', require('./routes/admin_routes/getOrders'));
app.use('/', require('./routes/admin_routes/user_routes/setUserAppData'));
app.use('/', require('./routes/admin_routes/getApnaMzpReviews'));
app.use('/', require('./routes/admin_routes/searchShop'));
app.use('/', require('./routes/admin_routes/createShop'));
app.use('/', require('./routes/admin_routes/user_routes/closeAppShops'));
app.use('/', require('./routes/admin_routes/admin_shop/getshopMenuItems'));
app.use('/', require('./routes/admin_routes/user_routes/changeBanners'));
app.use('/', require('./routes/admin_routes/sendBulkNotification'));
app.use('/', require('./routes/admin_routes/createDirectOrder'));
app.use('/', require('./routes/admin_routes/changeServiceStatus'));
app.use(
  '/',
  require('./routes/admin_routes/sathi_routes/updateDeliverySathiData')
);
app.use('/', require('./routes/admin_routes/getAllShops'));
app.use('/', require('./routes/admin_routes/subscription/updateSubscription'));
app.use('/', require('./routes/admin_routes/updateOrderStatus'));
app.use('/', require('./routes/admin_routes/toggleCheckout'));

// app.use(async (req,res,next)=>{
//     next(createError.NotFound("This Route Does Not Exsist"));
// })

// test
// const DeliverySathi = require('./models/DeliverySathi');
// const deliverySathi = new DeliverySathi({
//   phoneNo: '7985914177',
//   password: 'sathi@Rajan@591##',
//   isVerified: true,
// });
// deliverySathi.save().then(() => {
//   console.log('saved');
// });

const User = require('./models/User');
User.findOne({ phoneNo: '1234567890' }).then((user) => {
  if (!user) {
    User.create({
      phoneNo: '1234567890',
      name: 'Test',
      isVerified: true,
      otp: '1234',
    }).then(() => {
      console.log('Google play test user created');
    });
  }
});

// const Order = require('./models/Order');
// Order.updateMany({}, { tempOrder: false }).then(() => {
//   console.log('sfdsdgsdg');
// });

// db.getCollection('users').find({created_at: { $gte: ISODate("2022-12-18") }}).count()
// const Shop = require('./models/Shop')
// Shop.updateMany({},{allowSelfPickup: true,allowSelfPickupCOD: false}).then(()=>{
//     console.log("done")
// })

// const Order = require('./models/Order');

// Order.find({ created_at: { $gte: new Date('2023-04-26') } }).then((orders) => {
//   const res = {};
//   orders.forEach((o) => {
//     const currKey = o.created_at
//       .toString()
//       .split(' 2023')[0]
//       .replaceAll(' ', '-');

//     if (res[currKey] != null) {
//       res[currKey] += o.billingDetails.itemTotal;
//     } else {
//       res[currKey] = o.billingDetails.itemTotal;
//     }
//   });

//   console.log(res);
// });

// const ShopItem = require('./models/ShopItem')
// ShopItem.findByIdAndUpdate(
// {_id: "630f417f8212ba640150cccd"},
// { $set: { "categories.$[].shopItemDataList.$[].shopItemDataList": 0 } }).then(()=>{
//     console.log('done')
// })
// .catch(err => console.log(err))

// const Shop = require('./models/Shop');
// Shop.updateMany({}, { isNewShop: false }).then((out) => {
//   console.log('done');
// });

// const sendNotificationByTopic = require('./util/sendNotificationOnTopic')
// sendNotificationByTopic("apnamzp_admin", {
//     "type": "review_created",
//     "title": "New Review",
//     "desc": "A new review is made by a customer",
//     "data": "review_received"
// })

// const Shop = require('./models/Shop')
// Shop.find({}).then((shops)=>{
//     shops.forEach((shop)=>{
//         console.log(`${shop.name}:- ${shop._id.toString()}`)
//     })
// })

// const Subscription = require('./models/Subscription')
// const dateFns = require('date-fns')

// Shop.find({}).then(async (shops) => {

//     shops.forEach(async (shop)=>{
//         const subsAlreadyExsists = await Subscription.findOne({shopId: shop._id})
//         if(subsAlreadyExsists) return;

//         const todayDate = new Date()

//         const subs = Subscription.create({
//             shopId: shop._id,
//             startDate: dateFns.subDays(todayDate,1),
//             endDate: dateFns.addDays(todayDate,32),
//             isFree: true
//         })
//     })

// })

// const todayDate = new Date()
// const Subscription = require('./models/Subscription')
// const dateFns = require('date-fns')
// Subscription.updateMany({},{
//     endDate: dateFns.subDays(todayDate,1)
// }).then(()=>{
//     console.log('done')
// })

// const Order = require('./models/Order')
// Order.updateMany({orderStatus: {$gt: 7} },{orderStatus: 7}).then(()=>{
//     console.log('done')
// })

// const User = require('./models/User');
// const Order = require('./models/Order');
// const Shop = require('./models/Shop');

// User.find({}).then(async (users) => {
//   console.log('sarted');
//   let data = {};
//   for (let i = 0; i < users.length; i++) {
//     const user = users[i];
//     const orders = await Order.find({
//       userId: user.phoneNo,
//       orderStatus: 6,
//     });

//     // if(orders.length == 0){
//     //     console.log(`${user.phoneNo}, join date: ${user.created_at}`)
//     // }

//     // if (orders.length != 1) continue;

//     // const shop = await Shop.findOne({ _id: orders[0].shopID });
//     // const createdAt = orders[0].created_at.toString();
//     // if (orders.length == 1 && createdAt.includes('2023')) {
//     //   console.log(
//     //     `${user.phoneNo} , ${user.name} , ${shop.name} , ${createdAt}`
//     //   );
//     // }

//     if (orders.length >= 10) {
//       for (let i = 0; i < orders.length; i++) {
//         const createdAt = orders[i].created_at.toDateString().split(' ');
//         const key = (createdAt[1] + '-' + createdAt[3]).toLowerCase();

//         if (!key.includes('2023')) continue;

//         if (!data[key]) {
//           data[key][user.phoneNo]++;
//         } else {
//           data[key][user.phoneNo] = 1;
//         }

//         console.log(data[key]);
//       }
//     }
//   }
//   console.log(data);
// });

// const Order = require('./models/Order')
// const Shop = require('./models/Shop')

// Order.find({orderStatus: 7}).then((orders)=>{
//     orders.forEach(async (order)=>{
//         const shop = await Shop.findOne({_id: order.shopID})

//         let items = "";
//         for(let i=0;i<order.orderItems.length;i++){
//             const currItem = order.orderItems[i];
//             items += currItem.name + ","
//         }

//         console.log(`${order.userId} , ${shop.name} , ${order.cancelReason}, ${order.actualDistance}Km , (${items})`)
//     })
// })

// const Order = require('./models/Order');
// Order.find({}).then((orders) => {
//   const result = {};
//   for (let i = 0; i < orders.length; i++) {
//     const createdAt = orders[i].created_at.toDateString().split(' ');
//     const key = (createdAt[1] + '-' + createdAt[3]).toLowerCase();

//     if (result[key]) {
//       result[key].total_orders += 1;
//       result[key].total_amount += orders[i].billingDetails.totalPay;
//     } else
//       result[key] = {
//         total_orders: 1,
//         total_amount: orders[i].billingDetails.totalPay,
//       };
//   }
//   console.log(result);
// });

// const Order = require('./models/Order');
// const Shop = require('./models/Shop');
// const Subscription = require('./models/Subscription');

// Order.find({}).then(async (orders) => {
//   const result = {};
//   console.log('started');
//   for (let i = 0; i < orders.length; i++) {
//     const order = orders[i];
//     const createdAt = orders[i].created_at.toDateString().split(' ');
//     const shop = await Shop.findOne({ _id: order.shopID });

//     if (shop == null) continue;

//     if (result[shop.name] == null) {
//       result[shop.name] = {};
//     }

//     const monthKey = (createdAt[1] + '-' + createdAt[3]).toLowerCase();
//     if (monthKey != 'jan-2023') continue;

//     if (result[shop.name][monthKey]) {
//       result[shop.name][monthKey].totalSales += order.billingDetails.itemTotal;
//     } else {
//       const curr = {
//         totalSales: order.billingDetails.itemTotal,
//         amountPaid: 0,
//       };
//       result[shop.name][monthKey] = curr;
//     }
//   }

//   const subs = await Subscription.find({});
//   for (let i = 0; i < subs.length; i++) {
//     const sub = subs[i];
//     const shop = await Shop.findOne({ _id: sub.shopId });

//     if (shop == null) continue;

//     if (result[shop.name] == null) {
//       result[shop.name] = {};
//     }

//     const createdAt = sub.startDate.toDateString().split(' ');
//     const monthKey = (createdAt[1] + '-' + createdAt[3]).toLowerCase();

//     if (monthKey != 'jan-2023') continue;

//     if (result[shop.name][monthKey]) {
//       result[shop.name][monthKey].amountPaid = sub.payedAmount;
//     } else {
//       const curr = {
//         totalSales: 0,
//         amountPaid: sub.payedAmount,
//       };
//       result[shop.name][monthKey] = curr;
//     }
//   }

//   console.log(result);
// });

// payment test
// const generateToken = require('./routes/user_app_routes/payment/initOnlinePayment');

// app.get('/getToken', async (req, res, next) => {
//   const { orderId } = req.query;
//   const data = await generateToken(orderId);
//   console.log(data);
//   res.json({
//     token: data.body.txnToken,
//   });
// });

// const Razorpay = require('razorpay');
// const instance = new Razorpay({
//   key_id: 'rzp_test_yWzsnOXTqAZItl',
//   key_secret: 'QR5dXhIw6BJNhTX9LbFUfzN9',
// });

// app.get('/getOrderIdTest', async (req, res, next) => {
//   var options = {
//     amount: 100,
//     currency: 'INR',
//     receipt: 'Up63Cafe_payment_recipt',
//     notes: {
//       email: 'vaibhavbhardwaaj@gmail.com',
//     },
//   };

//   try {
//     instance.orders.create(options, function (err, order) {
//       if (err) throw err;

//       console.log(order);
//       res.json(order);
//     });

//     // res.json({
//     //     success: true
//     // })
//   } catch (err) {
//     next(err);
//   }
// });

// app.get('/verifypayment', async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   }
// });

app.get('/privacy_policy', async (req, res, next) => {
  res.sendFile(path.resolve(__dirname, './views/privacyPolicy.html'));
});

// global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    success: false,
    status: err.status || 500,
    desc: err.desc || err.message || 'Something went wrong',
    data: err.data,
  });
});

app.all('/', async (req, res) => {
  res.sendFile(path.resolve(__dirname, './views/index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running At Port ${process.env.PORT}`);
});
