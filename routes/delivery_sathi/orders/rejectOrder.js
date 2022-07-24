const express = require('express')
const Order = require('../../../models/Order')
const DeliverySathi = require('../../../models/DeliverySathi')
const Shop = require('../../../models/Shop')
const createHttpError = require('http-errors')
const axios = require('axios').default
const router = express.Router()

router.post('/sathi/rejectOrder',async (req,res,next)=>{
    const { orderId, deliverySathiNo, cancelReason } = req.query
    try{
        const order = await Order.findOne({_id: orderId});
        order.orderAcceptedByDeliverySathi = false
        order.assignedDeliveryBoy = ""

        await order.save()

        const shopData = await Shop.findOne({_id: order.shopID})

        if(shopData == null){
            throw createHttpError.InternalServerError("errr");
        }


        const deliverySathi = await DeliverySathi.findOne({phoneNo: deliverySathiNo})
        deliverySathi.currOrders -= 1
        await deliverySathi.save()


        const deliverySathiAssignInterval = setInterval(async ()=>{

            try{
                const assginedRes = await axios.post(`http://${process.env.HOST_NAME}/partner/assignDeliveryBoy?orderId=${order._id}&latitude=${shopData.addressData.latitude}&longitude=${shopData.addressData.longitude}&alreadyAssignedSathi=${deliverySathiNo}`,{})
                clearInterval(deliverySathiAssignInterval)
                if(assginedRes.success){
                    clearInterval(deliverySathiAssignInterval)
                }
            }
            catch(err){
                console.log(err)
            }

        },1000)

        res.json({
            success: false
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router;