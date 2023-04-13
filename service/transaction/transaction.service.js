const Transaction = require('../../models/Transaction');

module.exports = {
  createNewTransaction: async (phoneNo, walletId, amount) => {
    return await Transaction.create({ phoneNo, walletId, amount });
  },

  getAllTransactionsByPhoneNo: async (phoneNo, limit = 30) => {
    return await Transaction.find({ phoneNo })
      .sort({ createdAt: 1 })
      .limit(limit);
  },
};
