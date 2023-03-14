const express = require('express');
const router = express.Router();
const Shop = require('../../models/Shop');
const httpErrors = require('http-errors');

router.post('/apna_mzp/admin/toogle_checkout', async (req, res, next) => {
  try {
    const allShops = req.query.allShops;

    if (allShops == 'true') {
      const shops = await Shop.find({});
      for (let i = 0; i < shops.length; i++) {
        shops[i].allowCheckout = !shops[i].allowCheckout;
        await shops[i].save();
      }
    } else {
      const body = req.body;

      const shop = await Shop.findOne({ _id: body._id });

      if (!shop) {
        throw httpErrors.BadRequest();
      }

      shop.allowCheckout = body.allowCheckout;
      await shop.save();
    }

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
