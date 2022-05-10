const mongoose = require('mongoose');

// {"Order Placed","Order Confirmed","Order In Preperation",
// "Rider Assign","Rider Reached Shop","Rider On The Way","Order Delivered","Order Cancelled"};      "Rider Reached Shop","Rider On The Way","Order Arrived","Order Delivered","Order Cancelled"};



const Pricing = new mongoose.Schema({
    type: String,
    price: String
})

const orderItem = new mongoose.Schema({
    name: String,
    discount: String,
    quantity: String,
    pricings: [Pricing]
})

const orderSchema = new mongoose.Schema({
    orderItems: [orderItem],
    isPaid: Boolean,
    shopID: String,
    deliveryAddress: {
        houseNo: String,
        landmark: String,
        latitude: String,
        longitude: String,
        rawAddress: String
    },
    userId:{
        type: String,
        index: true
    },
    shopCategory: {
        type: String,
        index: true
    },
    billingDetails: {
        deliveryCharge: Number,
        isDeliveryService: Boolean,
        itemTotal: Number,
        offerDiscountedAmount: Number,
        totalDiscount: Number,
        totalTaxesAndPackingCharge: Number,
        totalPay: Number
    },
    orderStatus: {
        type: Number,
        default: 0
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    assignedDeliveryBoy: String,
    expectedDeliveryTime: String,
    cancelReason: String
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const Order = mongoose.model('order',orderSchema);
module.exports = Order;