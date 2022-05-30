const mongoose = require('mongoose');
const User = require('./User');


const partnerSchema = new mongoose.Schema({
    shopId: String,
    noOfOrders: Number,
    shopType: String
})

const ShopPartner = User.discriminator('ShopPartner',partnerSchema);
module.exports = ShopPartner;