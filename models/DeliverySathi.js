const mongoose = require('mongoose');
const User = require('./User');

const deliverySathiSchema = new mongoose.Schema({
    earnings: {
        type: Number,
        default: 0
    },
    incentives: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    cashInHand: {
        type: Number,
        default: 0
    }
})

const DeliverySathi = User.discriminator('DeliverySathi',deliverySathiSchema);
module.exports = DeliverySathi;