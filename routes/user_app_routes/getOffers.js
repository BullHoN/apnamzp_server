const express = require('express');
const router = express.Router();
const Offer = require('../../models/Offer');
const Shop = require('../../models/Shop');

router.get('/getOffers', async (req, res, next) => {
  const isApnaMzpDiscount = req.query.onlyAdmin == 'true' ? true : false;
  const allOffers = req.query.allOffers == 'true' ? true : false;
  const shopId = req.query.shopId;

  try {
    if (allOffers) {
      const data = await Offer.find({ showShop: true }).sort({
        discountAbove: 1,
      });
      let mappedData = [];
      for (let i = 0; i < data.length; i++) {
        let offer = data[i];
        if (offer.isApnaMzpDiscount) {
          mappedData.push(offer);
          continue;
        }

        offer = await insertShopNameAndImageUrl(offer);
        mappedData.push(offer);
      }

      res.json(mappedData);
    } else if (shopId) {
      const data = await Offer.find({ shopId: shopId, showShop: true }).sort({
        discountAbove: 1,
      });
      res.json(data);
    } else if (isApnaMzpDiscount) {
      const data = await Offer.find({
        isApnaMzpDiscount: isApnaMzpDiscount,
        showShop: true,
      }).sort({ discountAbove: 1 });
      res.json(data);
    } else {
      const data = await Offer.find({
        $or: [
          {
            isApnaMzpDiscount: true,
          },
          {
            shopName: req.query.shopName,
          },
        ],
      }).sort({ discountAbove: 1 });
      res.json(data);
    }
  } catch (error) {
    next(error);
  }
});

async function insertShopNameAndImageUrl(offer) {
  const shop = await Shop.findOne({ _id: offer.shopId });
  return { ...offer._doc, shopName: shop.name, bannerImage: shop.bannerImage };
}

module.exports = router;
