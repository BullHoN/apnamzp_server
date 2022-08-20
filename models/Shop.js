const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name:String,
    tagLine:String,
    isOpen: {
        type: Boolean,
        default: false
    },
    averageDeliveryTime: String,
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
        default: false
    },
    adminShopService: {
        type: Boolean,
        default: false
    },
    showShop: {
        type: Boolean,
        default: false
    },
    increaseDisplayPricePercentage: {
        type: Number,
        default: 0
    },
    fssaiCode: String
});


const Shop = mongoose.model('Shop',shopSchema);
module.exports = Shop;