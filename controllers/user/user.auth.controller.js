const User = require('../../models/User')
const httpErrors = require('http-errors')
const sendOtp = require('../../util/sendOtp')
const DeliverySathi = require('../../models/DeliverySathi')
const ShopPartner = require('../../models/ShopPartner');

module.exports = {

    login: async (req,res,next) => {
        try {
            const phoneNo = req.query.phoneNo;
            const password = req.query.password;
        
            const user = await User.findOne({phoneNo: phoneNo,__t: null});
        
            if(user == null){
                throw httpErrors.NotFound("User Not Found");
            }
            
            const isMatch = await user.isValidPassword(password);
     
            if(isMatch){
                res.json({
                    success: true,
                    data: user.name
                });
            }
            else {
                throw httpErrors.Unauthorized("Incorrect Password")
            }
    
        } catch (error) {
            next(error);
        }
    },

    userAlreadyExsists: async (req,res,next) => {
        const phoneNo = req.query.phoneNo;
        const user = await User.findOne({phoneNo: phoneNo});
    
        try {
            if(user == null){
                const otp = generateOTP();
                const newUser = await (new User({phoneNo: phoneNo,otp:otp}).save());    
                sendOtp(phoneNo,otp);
        
                res.json({
                    success: false
                });
            }
            else {
    
                if(user.__t){
                    throw httpErrors.BadRequest("You already have account on our Partner/Sathi App")
                }
                
                if(!user.isVerified){
                    const otp = generateOTP();
                    user.otp = otp;
                    await user.save();
                
                    sendOtp(phoneNo,otp);
                    res.json({
                        success: true
                    });
                    return;
                }
    
                res.json({
                    success: true
                });
            }        
        } catch (error) {
            next(error)
        }
    },

    registerUser: async (req,res,next) => {
        const { username, password, phoneNo, name } = req.body;

        try {
            const user = await User.findOne({phoneNo: phoneNo});

            if(user.__t){
                throw httpErrors.BadRequest("You already have account on our Partner/Sathi App")
            }

            user.name = username;
            user.password = password;
            const hashedPassword = await user.encryptPassword(password)
            user.password = hashedPassword

            user.name = name;
            user.isVerified = true;

            await user.save();     
            
            res.json({
                success: true
            })

        } catch (error) {
            next(error)
        }
    },

    sendOtp: async (req,res,next) => {
        const phoneNo = req.query.phoneNo;

        try{
            const user = await User.findOne({phoneNo:phoneNo});
            if(user == null){
                throw httpErrors.NotFound("User Not Found");
            }
            const otp = generateOTP();
            user.otp = otp;
            await user.save();
        
            sendOtp(phoneNo,otp);
    
            res.json({
                success: true
            });
        }
        catch(error){
            next(error)
        }
    },

    verifyOtp: async (req,res,next) => {
        const phoneNo = req.query.phoneNo;
        const otp = req.query.otp;
    
        try {
            const user = await User.findOne({phoneNo: phoneNo});
            if(user.otp != otp){
                res.json({
                    success: false
                })
            }
            else {
                res.json({
                    success: true
                })
            }        
        } catch (error) {
            next(error)
        }
    },

    updateFCMToken: async (req,res,next) => {
        const body = req.body;
        const type = req.query.user_type;
    
        try{
            if(type == "user"){
                await User.findOneAndUpdate({phoneNo: body.phoneNo},{fcmId: body.fcmId});
            }
            else if(type == "sathi"){
                await DeliverySathi.findOneAndUpdate({phoneNo: body.phoneNo},{fcmId: body.fcmId});
            }
            else{ 
                await ShopPartner.findOneAndUpdate({phoneNo: body.phoneNo},{fcmId: body.fcmId});
            }
    
            res.json({
                success: true
            })
    
        }
        catch(error){
            next(error);
        }
    }

}

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

