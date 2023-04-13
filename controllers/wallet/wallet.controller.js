const httpErrors = require('http-errors');
const Wallet = require('../../service/wallet/wallet.service');
const Transaction = require('../../service/transaction/transaction.service');

module.exports = {
  getWalletByPhoneNo: async (req, res, next) => {
    try {
      const phoneNo = req.params.phoneNo;
      if (!phoneNo) {
        throw httpErrors.BadRequest('Please Provide PhoneNo');
      }

      let wallet = await Wallet.findAWalletByPhoneNo(phoneNo);
      if (!wallet) {
        wallet = await Wallet.createNewWallet(phoneNo);
      }

      res.json(wallet);
    } catch (err) {
      next(err);
    }
  },

  updateWallet: async (req, res, next) => {
    try {
      const phoneNo = req.body.phoneNo;
      const amount = req.body.amount;

      if (!phoneNo || !amount) {
        throw httpErrors.BadRequest();
      }

      let wallet = await Wallet.findAWalletByPhoneNo(phoneNo);
      if (!wallet) {
        throw httpErrors.BadRequest();
      }

      if (wallet.amount - wallet.minBalance + amount < 0) {
        throw httpErrors.BadRequest('Not Enough balance');
      }

      await Wallet.updateWalletAmount(phoneNo, amount);

      await Transaction.createNewTransaction(phoneNo, wallet._id, amount);

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  getTransactionsByPhoneNo: async (req, res, next) => {
    try {
      const phoneNo = req.params.phoneNo;
      if (!phoneNo) {
        throw httpErrors.BadRequest('Please Provide PhoneNo');
      }

      const transactions = await Transaction.getAllTransactionsByPhoneNo(
        phoneNo
      );

      res.json(transactions);
    } catch (err) {
      next(err);
    }
  },
};
