const mongoose = require('mongoose');
const User = require('./User');

const deliverySathiSchema = new mongoose.Schema({
    earnings: Number,
    incentives: Number
})

const DeliverySathi = User.discriminator('DeliverySathi',deliverySathiSchema);
module.exports = DeliverySathi;