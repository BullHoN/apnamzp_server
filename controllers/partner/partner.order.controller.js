const geolib = require('geolib');
const localDB = require('../../util/localDB/localDB');
const Order = require('../../models/Order')
const DeliverySathi = require('../../models/DeliverySathi')
const sendNotification = require('../../util/sendNotification')
const User = require('../../models/User')

// {latitude: "25.133699", longitude: "82.564430"}
// 25.13649844681555, 82.56680760096513
// 28.84196614894497, 77.57740291535762


module.exports = {

    assignDeliveryBoy: async (req,res,next)=>{

        const { orderId, latitude, longitude } = req.query;
        
        try{

            const order = await Order.findById({_id: orderId});
            const user = await User.findOne({phoneNo: order.userId})
            
            let assignedDeliveryBoy = {dist: Number.MAX_SAFE_INTEGER}
            let assignDeliveryBoyInterval = setInterval(async ()=>{
    
                let deliverySathis = await localDB.get('deliverySathis');
                deliverySathis = JSON.parse(deliverySathis);
    
                let keys = Object.keys(deliverySathis)
    
                console.log(keys.length)
    
                for(let i=0;i<keys.length;i++){
                    const key = keys[i]
                    const curr = deliverySathis[key];
                    const dist = getDistance({latitude: Number.parseFloat(curr["latitude"]),longitude: Number.parseFloat(curr["longitude"])}
                    ,{latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude)});
            
                    const deliverySathi = await DeliverySathi.findOne({phoneNo: key})
                    
                    if(deliverySathi.currOrders == 0 && dist < assignedDeliveryBoy.dist){
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
                        "data":"zeher",
                        "type": "order",
                        "title": "nya order aa gya bhai",
                        "desc": "jake de aa order bhai"
                    })
                    

                    sendNotification(user.fcmId,{
                        "data": "assdgsdg",
                        "type": "order_status_change",
                        "title": "Delivery Sathi Assigned",
                        "desc": "Your Delivery Sathi is assigned",
                        "orderId": orderId
                    })

                }
    
                console.log("delivey sathi seen kya hai", assignedDeliveryBoy)
    
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

