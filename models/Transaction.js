const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  walletId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
