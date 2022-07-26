const geolib = require('geolib');
const localDB = require('../../util/localDB/localDB');
const Order = require('../../models/Order')
const DeliverySathi = require('../../models/DeliverySathi')
const sendNotification = require('../../util/sendNotification')
const sendNotificationByTopic = require('../../util/sendNotificationOnTopic')
const User = require('../../models/User')
const createError = require('http-errors')
const Shop = require('../../models/Shop')
const client = require('../../util/init_redis')

// {latitude: "25.133699", longitude: "82.564430"}
// 25.13649844681555, 82.56680760096513
// 28.84196614894497, 77.57740291535762


module.exports = {

    assignDeliveryBoy: async (req,res,next)=>{

        const { orderId, latitude, longitude, alreadyAssignedSathi } = req.query;
        
        if(orderId == undefined || latitude == undefined || longitude == undefined){
            throw createError.BadRequest("Bad Request");
        }

        try{

            const order = await Order.findById({_id: orderId});
            const shopData = await Shop.findOne({shopType: order.shopCategory,_id: order.shopID});
            const user = await User.findOne({phoneNo: order.userId})
            
            let assignedDeliveryBoy = {dist: Number.MAX_SAFE_INTEGER}
            let tries = 0;
            let assignDeliveryBoyInterval = setInterval(async ()=>{
    
                let deliverySathis = await localDB.get('deliverySathis');
                deliverySathis = JSON.parse(deliverySathis);
    
                let keys = Object.keys(deliverySathis)
    
                console.log(keys.length)
    
                if(tries > 1){
                    //TODO: send notification to admin
                    let pendingOrders = await client.get("pendingOrders")
                    if(pendingOrders == null) pendingOrders = []
                    else pendingOrders = JSON.parse(pendingOrders)
                    await client.set("pendingOrders",JSON.stringify([...pendingOrders,order]))
                    
                    console.log("send order to admin")
                    // send notification to user on the topuc 
                    sendNotificationByTopic("pending_orders",{
                        "type": "pending"
                    })

                    clearInterval(assignDeliveryBoyInterval)

                    return;
                }

                for(let i=0;i<keys.length;i++){
                    const key = keys[i]
                    const curr = deliverySathis[key];
                    const dist = getDistance({latitude: Number.parseFloat(curr["latitude"]),longitude: Number.parseFloat(curr["longitude"])}
                    ,{latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude)});
            
                    const deliverySathi = await DeliverySathi.findOne({phoneNo: key})
                    
                    console.log(alreadyAssignedSathi,key,(alreadyAssignedSathi != key))

                    if(deliverySathi.currOrders == 0 && dist < assignedDeliveryBoy.dist && alreadyAssignedSathi != deliverySathi.phoneNo){
                        assignedDeliveryBoy = curr;
                        assignedDeliveryBoy.dist = dist;
                    }
                    
                    // TODO: remove this
                    // assignedDeliveryBoy = curr;
                    // assignedDeliveryBoy.dist = dist;
                }
                
                if(assignedDeliveryBoy.phoneNo != null){
                    clearInterval(assignDeliveryBoyInterval)
                    
                    order.assignedDeliveryBoy = assignedDeliveryBoy.phoneNo
                    await order.save();
    
                    const deliverySathi = await DeliverySathi.findOne({phoneNo: assignedDeliveryBoy.phoneNo})
                    deliverySathi.currOrders += 1;
                    await deliverySathi.save();
            
                    sendNotification(assignedDeliveryBoy.fcmId,{
                        "data": JSON.stringify({
                            shopInfo: {
                                name: shopData.name,
                                phoneNo: shopData.phoneNO,
                                rawAddress: shopData.addressData.mainAddress,
                                latitude: shopData.addressData.latitude,
                                longitude: shopData.addressData.longitude
                            },
                            _id: order._id
                        }),
                        "type": "order",
                        "title": "nya order aa gya bhai",
                        "desc": "jake de aa order bhai" 
                    })

                }
                
                
                console.log("delivey sathi seen kya hai", assignedDeliveryBoy)

                tries++

            },1 * 1000 * 60)
    
            
            res.json({
                success: true
            })
        }
        catch(error){
            next(error)
        }

    }

}


function getDistance(from,to){
    return geolib.getDistance(from,to);
}

