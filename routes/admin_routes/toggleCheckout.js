const express = require('express');
const router = express.Router();
const Shop = require('../../models/Shop');
const httpErrors = require('http-errors');

router.post('/apna_mzp/admin/toogle_checkout', async (req, res, next) => {
  try {
    const allShops = req.query.allShops;

    if (allShops == 'true') {
      const action = req.query.action == 'true';
      await Shop.updateMany({}, { allowCheckout: action });
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
