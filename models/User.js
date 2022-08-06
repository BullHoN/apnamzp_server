const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    phoneNo: String,
    name: String,
    password: String,
    fcmId: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })


userSchema.methods.encryptPassword =  async function (password){
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password,salt)
        return hashedpassword
    } catch (error) {
        next(error);
    }

}

userSchema.methods.isValidPassword = async function (password) {
    try {
       return await bcrypt.compare(password,this.password)
    } catch (error) { 
        next(error);
    }
}

const User = mongoose.model('User',userSchema);
module.exports = User;