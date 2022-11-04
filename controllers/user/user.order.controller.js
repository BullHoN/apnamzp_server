const Order = require('../../models/Order');
const ShopPartner = require('../../models/ShopPartner');
const Shop = require('../../models/Shop');
const sendNotification = require('../../util/sendNotification');
const httpErrors = require('http-errors');
const axios = require('axios').default
const client = require('../../util/init_redis')
const Razorpay = require('razorpay')
const instance = new Razorpay(
    { key_id: process.env.RAZOR_PAY_KEY, key_secret: process.env.RAZOR_PAY_SECRET }
)
const geolib = require('geolib');

const ABOVE_DISTANCE_FIVE_PRICE = 15;
const BELOW_DISTANCE_FIVE_PRICE = 5;

const EDGE_LOCATIONS_DEFAULT = [ "jangi", "lohandi", "gango", "kirtarrata"]
const EDGE_LOCATION_DEFAULT_INC = 20

// TODO: get these from redis
let itemsOnTheWayCostDefault = 10;
let slurgeChargesDefault = 10;
let slurgeReasonDefault = "barish hai bhaiya kha se le ay khana aapka";
let processingFeeDefault =  { init: 10, inc: 5, jump: 100 }


module.exports = {

    checkout: async (req,res,next) => {
        try {   
            let blockedCODUsers = await client.get("blockedCODUsers")
            if(blockedCODUsers) blockedCODUsers = JSON.parse(blockedCODUsers)
            else {
                blockedCODUsers = []
                client.set("blockedCODUsers",JSON.stringify([]))
            }
    
            const order = new Order(req.body);
    
            for(let i=0;i<blockedCODUsers.length;i++){
                if(blockedCODUsers[i] == order.userId && !order.isPaid){
                    throw httpErrors.BadRequest("You Have Been Blocked By Resturant, Please Try Prepaid Order Or Contact Apna Mzp")
                }
            }
    
            // self service is only when order is managed by shop
            if(!order.billingDetails.isDeliveryService){
                order.billingDetails.deliveryCharge = 0
            }
            
    
            // send notification to the shop
            const shopData = await Shop.findOne({_id: req.body.shopID});
            const shopUser = await ShopPartner.findOne({phoneNo: shopData.phoneNO});
            
            if(!shopData.isOpen){
                throw httpErrors.BadRequest("Shop is currently closed please try again later")
            }
    
            if(!shopData.allowCheckout){
                throw httpErrors.BadRequest("Shop is currently unavaible for delivery service")
            }
    
            if(shopData.adminShopService){
                order.paymentReceivedToShop = true
                order.expectedDeliveryTime = "15min"
            }
    
            await order.save();
            
    
            
            if(order.adminShopService){
                const deliverySathiAssignInterval = setInterval(async ()=>{
    
                    try{
                        const assginedRes = await axios.post(`${process.env.HTTP_HOST}://${process.env.HOST_NAME}/partner/assignDeliveryBoy?orderId=${order._id}&latitude=${shopData.addressData.latitude}&longitude=${shopData.addressData.longitude}`,{})
                        clearInterval(deliverySathiAssignInterval)
                        if(assginedRes.success){
                            clearInterval(deliverySathiAssignInterval)
                        }
                    }
                    catch(err){
                        console.log(err)
                    }
    
                },1000)
            }
            else {
                sendNotification(shopUser.fcmId,{
                    "orderItems":  JSON.stringify(req.body.orderItems),
                    "_id": order._id.toString(),
                    "userId": req.body.userId,
                    "type": "new_order",
                    "totalPay":  (getTotalReceivingAmount(order.billingDetails,order.offerCode) + ""),
                    "isDeliveryService": ((order.billingDetails.isDeliveryService == true) + ""),
                })
            }
    
            res.json({
                success: true
            });        
            
        } catch (error) {
            next(error)
        }
    },

    getOrders: async (req,res,next) => {
        const userId = req.query.userId;

        try{
            const orders = await Order.find({userId: userId}).sort({ created_at: -1 });
            const mappedOrders = await mapOrderWithShopDetails(orders);
        
            res.json(mappedOrders);
        }
        catch(error){
            next(error)
        }
    },

    getOrder: async (req,res,next) => {
        const order_id = req.query.order_id;

        try {

            const order = await Order.findOne({_id: order_id})

            if(order == null){
                throw httpErrors.BadRequest();
            }

            const mappedShopData = await mapOrderWithShopDetails(order);
            res.json(mappedShopData)

        } catch (error) {
            next(error)
        }
    },

    createPaymentId: async (req,res,next) => {
        try{

            const shop = await Shop.findOne({_id: req.query.shopId});
            if(!shop.isOpen){
                throw httpErrors.BadRequest("Shop is currently Closed")
            }
    
            var options = {
                amount: req.body.amount,  
                currency: "INR",
                receipt: "ApnaMzp_payment_recipt",
                payment_capture: 1,
                notes:{
                  phoneNo: req.body.userPhoneNo
                 }
            };
        
            try{
                instance.orders.create(options,function(err,order){
                    if(err) throw err
        
                    res.json({
                        paymentId: order.id
                    })
                  })
        
            }
            catch(err){
                next(err)
            }        
        }
        catch(err){
            next(err)
        }
    },

    calculateDeliveryCharge: async (req,res,next) => {
        try {

            const customerInRange = await isUserLocationReachable(req.query.destinations)
            if(!customerInRange){
                // throw HttpError.BadRequest("Sorry our service is not available in your area.")
                res.json({distance: "-1", actualDistance: "-1"});
                return;
            }
    
            const distanceRes = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${req.query.destinations}&origins=${req.query.origins}&key=AIzaSyCjGoldXj1rERZHuTyT9iebSRFc_O3YHX4`);
            let distance = Number.parseInt(distanceRes.data['rows'][0]['elements'][0]['distance']['value'])/1000.0;
            
            let edgeLocationsData = await client.get("edgeLocationsData")
            if(edgeLocationsData) edgeLocationsData = JSON.parse(edgeLocationsData)
            else {
                edgeLocationsData = {
                    locations: EDGE_LOCATIONS_DEFAULT,
                    priceInc: EDGE_LOCATION_DEFAULT_INC
                }
    
                await client.set("edgeLocationsData", JSON.stringify(edgeLocationsData))
            }
    
            let extraCharges = edgeLocationsCharges(distanceRes.data.destination_addresses[0]
                , edgeLocationsData.locations, edgeLocationsData.priceInc)
            
            console.log(extraCharges)
            if(distance <= 2.5){
                // TODO: Get all this from redis cache
                res.json({distance: ((25 + extraCharges) + ""), actualDistance: distance});
                return;
            }
            else if(distance <= 6){
                let amount = 25 + Math.ceil(Math.ceil(distance)-2.5) * BELOW_DISTANCE_FIVE_PRICE
                res.json({distance: ((amount + extraCharges) +""), actualDistance: distance});
                return;
            }
            else if(distance <= 8){
                let amount = Math.ceil(distance) * ABOVE_DISTANCE_FIVE_PRICE;
                res.json({distance: ((amount + extraCharges) +""), actualDistance: distance})
            }
            else {
                res.json({distance: "-1", actualDistance: "-1"});
                return;
            }        
        } catch (error) {
            next(error)
        }
    },

    getCartMetaData: async (req,res,next) => {
        try{

            const itemsOnTheWayCost = await client.get("itemsOnTheWayCost")
            if(itemsOnTheWayCost == null) await client.set("itemsOnTheWayCost",itemsOnTheWayCostDefault,{
                'EX': 365 * 24 * 60 * 60
            })
            const slurgeCharges = await client.get("slurgeCharges")
            if(slurgeCharges == null) await client.set("slurgeCharges",slurgeChargesDefault,{
                'EX': 365 * 24 * 60 * 60
            })
    
            const slurgeReason = await client.get("slurgeReason")
            if(slurgeReason == null) await client.set("slurgeReason",slurgeReasonDefault,{
                'EX': 365 * 24 * 60 * 60
            })
    
            let processingFee = await client.get("processingFee")
            if(processingFee == null) await client.set("processingFee",JSON.stringify(processingFeeDefault),{
                'EX': 365 * 24 * 60 * 60
            })
            else processingFee = JSON.parse(processingFee)
    
            res.json({
                itemsOnTheWayCost: itemsOnTheWayCost || itemsOnTheWayCostDefault,
                slurgeCharges: slurgeCharges || slurgeChargesDefault,
                slurgeReason: slurgeReason || slurgeReasonDefault,
                processingFee: processingFee || processingFeeDefault
            })
        }
        catch(err){
            next(err)
        }
    }

}

function getTotalReceivingAmount(billingDetails,offerCode){
    let totalReceivingAmount = billingDetails.itemTotal + billingDetails.totalTaxesAndPackingCharge + billingDetails.totalTaxesAndPackingCharge
    if(offerCode != null && offerCode != "" && !offerCode.includes("APNA")){
        totalReceivingAmount -= billingDetails.offerDiscountedAmount
    }

    if(billingDetails.itemTotal >= billingDetails.freeDeliveryPrice){
        totalReceivingAmount -= billingDetails.deliveryCharge
    }

    return totalReceivingAmount
}

async function mapOrderWithShopDetails(orders){
    return new Promise(async (resolve,reject)=>{
        let mappedOrders = [];
        for(let i=0;i<orders.length;i++){
            const order = orders[i];
            const shopData = await Shop.findOne({_id: order.shopID});
            
            mappedOrders.push({
                _id: order._id,
                orderItems: order.orderItems,
                isPaid: order.isPaid,
                shopID: order.shopID,
                deliveryAddress: order.deliveryAddress,
                userId: order.userId,
                shopCategory: order.shopCategory,
                billingDetails: order.billingDetails,
                orderStatus: order.orderStatus,
                cancelled: order.cancelled,
                shopData: {
                    name: shopData.name,
                    bannerImage: shopData.bannerImage,
                    addressData: shopData.addressData
                },
                cancelReason: order.cancelReason,
                assignedDeliveryBoy: order.assignedDeliveryBoy,
                itemsOnTheWay: order.itemsOnTheWay,
                itemsOnTheWayCancelled: order.itemsOnTheWayCancelled,
                userFeedBack: order.userFeedBack,
                expectedDeliveryTime: order.expectedDeliveryTime,
                created_at: order.created_at
            });
        }
        resolve(mappedOrders);
    })
}

function edgeLocationsCharges(userAddress, edgeLocations, edgeInc){

    for(let i=0;i<edgeLocations.length;i++){
        const loc = edgeLocations[i]
        if(userAddress.toLowerCase().includes(loc)){
            return edgeInc
        }
    }

    return 0
}   

async function isUserLocationReachable(custLatLang){
    const shops = await Shop.find({})

    let shops_around_customer = 0;
    for(let i=0;i<shops.length;i++){
        const shop = shops[i]

        const cusLat = custLatLang.split("%2C")[0]
        const custLong = custLatLang.split("%2C")[1]

        let dist = getDistance(
            {
                latitude: Number.parseFloat(cusLat),
                longitude: Number.parseFloat(custLong)
            },
            {
                latitude: Number.parseFloat(shop.addressData.latitude),
                longitude: Number.parseFloat(shop.addressData.longitude)
            }
        );

        dist = dist / 1000.0
        console.log(dist,shop.name)

        if(Math.ceil(dist) <= 3){
            shops_around_customer++;
        }

    }

    return (shops_around_customer < 2) ? false : true;

}

function getDistance(from,to){
    return geolib.getPreciseDistance(from,to);
}
