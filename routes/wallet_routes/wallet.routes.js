const express = require('express');
const router = express.Router();
const WalletController = require('../../controllers/wallet/wallet.controller');

//GET /wallet/:phoneNo
router.get('/:phoneNo', WalletController.getWalletByPhoneNo);

//POST /wallet/
router.post('/', WalletController.updateWallet);

// GET /wallet/transactions/:phoneNo
router.get('/transactions/:phoneNo', WalletController.getTransactionsByPhoneNo);

module.exports = router;
