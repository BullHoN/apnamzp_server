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
        
});


const Shop = mongoose.model('Shop',shopSchema);
module.exports = Shop;