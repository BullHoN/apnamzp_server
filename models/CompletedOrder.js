const mongoose = require('mongoose')
const Order = require('./Order')

const CompletedOrderSchema = new mongoose.Schema({
    orderCompletedAt: String
})


const CompletedOrder = Order.discriminator('CompletedOrder',CompletedOrderSchema)
module.exports = CompletedOrder