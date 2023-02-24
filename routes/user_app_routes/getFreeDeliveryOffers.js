const express = require('express');
const router = express.Router();
const Shop = require('../../models/Shop');

router.get('/user/free-delivery-offers', async (req, res, next) => {
  try {
    const shops = await Shop.find({ showShop: true });
    let result = [];
    shops.forEach((shop) => {
      let temp = Number.parseInt(shop.pricingDetails.minFreeDeliveryPrice);
      if (temp < 2000) {
        result.push({
          shopName: shop.name,
          shopId: shop._id,
          bannerImage: shop.bannerImage,
          discountAbove: shop.pricingDetails.minFreeDeliveryPrice,
        });
      }
    });

    result.sort((a, b) => {
      return (
        Number.parseInt(a.discountAbove) - Number.parseInt(b.discountAbove)
      );
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
