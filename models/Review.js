const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userName: String,
    rating: String,
    userMessage: {
        type: String,
        default: ""
    },
    shopName: String
})

const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;