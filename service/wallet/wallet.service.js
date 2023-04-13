const Wallet = require('../../models/Wallet');

module.exports = {
  findAWalletByPhoneNo: async (phoneNo) => {
    return await Wallet.findOne({ phoneNo }, { __v: 0 });
  },

  createNewWallet: async (phoneNo) => {
    return await Wallet.create({ phoneNo });
  },

  updateWalletAmount: async (phoneNo, amount) => {
    return await Wallet.findOneAndUpdate({ phoneNo }, { $inc: { amount } });
  },
};
