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
        type: String,
        required: true
    },
    endDate: {
        type: String,
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
    }
})


const Subscription = mongoose.model('Subscription',subscriptionSchema)
module.exports = Subscription