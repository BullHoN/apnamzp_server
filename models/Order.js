const mongoose = require('mongoose');

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
    shopCategory: String,
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
    }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const Order = mongoose.model('order',orderSchema);
module.exports = Order;