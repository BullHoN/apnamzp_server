const mongoose = require('mongoose')

const subscriptionSchema = mongoose.Schema({
    shopId: {
        type: String,
        required: true,
        index: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    payedAmount: { 
        type: Number,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    paymentId: {
        type: String
    }
})


const Subscription = mongoose.model('Subscription',subscriptionSchema)
module.exports = Subscription