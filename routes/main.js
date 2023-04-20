const express = require('express');
const router = express.Router();
const WalletRoutes = require('./wallet_routes/wallet.routes');
const path = require('path');

router.use('/wallet', WalletRoutes);
router.get('/download/v1/apnamzp', async (req, res) => {
  res.sendFile(path.resolve(__dirname, 'apnamzp.apk'), (err) => {
    if (err) console.log(err);
  });
});

module.exports = router;
