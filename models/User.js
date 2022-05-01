const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNo: String,
    name: String,
    password: String,
    fcmId: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

const User = mongoose.model('User',userSchema);
module.exports = User;