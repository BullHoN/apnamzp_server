const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
  phoneNo: {
    type: String,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  minBalance: {
    type: Number,
    default: 0,
  },
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;
