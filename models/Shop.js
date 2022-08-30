const { default: roundToNearestMinutes } = require('date-fns/roundToNearestMinutes');
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name:String,
    tagLine:String,
    isOpen: {
        type: Boolean,
        default: false
    },
    averageDeliveryTime: {
        type: String,
        default: "30-40min"
    },
    pricingDetails:{
        minOrderPrice: String,
        minFreeDeliveryPrice: String
    },
    addressData:{
        mainAddress: String,
        latitude: String,
        longitude: String
    },
    averageRatings: {
        type: Number,
        default: 5.0
    },
    reviews: {
        type: String,
        default: "0"
    },
    reviewsID: String,
    menuItemsID: String,
    
    bannerImage: String,
    shopType: {
        type: String,
        index: true
    },
    phoneNO: String,
    taxPercentage: {
        default: "0",
        type: String
    },
    increasePriceByPercentage: {
        type: String,
        default: "0"
    },
    allowCheckout: {
        type: Boolean,
        default: roundToNearestMinutes
    },
    adminShopService: {
        type: Boolean,
        default: false
    },
    showShop: {
        type: Boolean,
        default: true
    },
    increaseDisplayPricePercentage: {
        type: Number,
        default: 30
    },
    fssaiCode: String,
    allowProcessingFees: {
        type: Boolean,
        default: false
    }
});


const Shop = mongoose.model('Shop',shopSchema);
module.exports = Shop;