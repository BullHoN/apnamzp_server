const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    code: String,
    offerType: String,
    isApnaMzpDiscount: Boolean,
    shopName: {
        type: String,
        index: true
    },
    shopId: {
        type: String,
        index: true
    },
    discountAbove: String,

    // Type1 : "percent"
    discountPercentage: String,
    maxDiscount: String,

    // Type2 : "flat"
    discountAmount: String

})

const Offer = mongoose.model('Offer',offerSchema);
module.exports = Offer;