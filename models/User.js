const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNo: String,
    name: String,
    password: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String
})

const User = mongoose.model('User',userSchema);
module.exports = User;