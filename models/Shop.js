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
    shopTimings: String,
    pricingDetails:{
        minOrderPrice: {
            type: String,
            default: "0"
        },
        minFreeDeliveryPrice: {
            type: String,
            default: "2000"
        }
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
        default: true
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
    },
    allowCOD: {
        type: Boolean,
        default: true
    },
    allowSelfPickup: {
        type: Boolean,
        default: false
    },
    allowSelfPickupCOD: {
        type: Boolean,
        default: true
    },
    allowSubscription: {
        type: Boolean,
        default: true
    },
    processingFees: {
        init: {
            type: Number,
            default: 0
        },
        inc: {
            type: Number,
            default: 0
        },
        jump: {
            type: Number,
            default: 1
        }
    }
});


const Shop = mongoose.model('Shop',shopSchema);
module.exports = Shop;