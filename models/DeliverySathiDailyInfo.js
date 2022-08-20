const mongoose = require('mongoose')

const deliverySathiDailyInfoSchema = new mongoose.Schema({
    loginTime: Number,
    incentives: Number,
    earnings: Number,
    totalOrders: Number
})


const DeliverySathiInfo = mongoose.model('DeliverySathiInfo',deliverySathiDailyInfoSchema)
module.exports = DeliverySathiInfo
