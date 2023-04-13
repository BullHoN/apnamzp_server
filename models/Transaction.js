const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    phoneNo: {
      type: String,
      required: true,
      index: true,
    },
    walletId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
