const express = require('express');
const router = express.Router();
const Shop = require('../../models/Shop');
const Subscription = require('../../models/Subscription');

router.get('/apna_mzp/admin/all-shops', async (req, res, next) => {
  try {
    let result = [];
    const shops = await Shop.find({});
    for (let i = 0; i < shops.length; i++) {
      const shop = shops[i];
      const currentSubsciption = await Subscription.findOne({
        shopId: shop._id,
        isActive: true,
      });

      result.push({
        name: shop.name,
        allowCheckout: shop.allowCheckout,
        _id: shop._id,
        currentSubsciption,
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
