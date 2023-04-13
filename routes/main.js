const express = require('express');
const router = express.Router();
const WalletRoutes = require('./wallet_routes/wallet.routes');

router.use('/wallet', WalletRoutes);

module.exports = router;
