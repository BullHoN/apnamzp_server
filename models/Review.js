const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userName: String,
    rating: String,
    userMessage: {
        type: String,
        default: ""
    },
    reviewType: String, // shop,sathi,apna
    orderId: String,
    shopName: String
})

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;