const loadData = require('./loadData');
const ShopItem = require('../models/ShopItem');
const Shop = require('../models/Shop');
const print = require('./printFullObject');

async function insertItem(path){
    const data = await loadData(path);

    const shopItem = new ShopItem({
        categories: data["categories"]
    })
    await shopItem.save();

    const shop = new Shop({
        name: data["shopDetails"]["Name Of Shop"],
        tagLine: data["shopDetails"]["Tagline"],
        averageDeliveryTime: data["shopDetails"]["Average Delivery Time"],
        pricingDetails: {
            minOrderPrice: data["shopDetails"]["Min Order Price"],
            minFreeDeliveryPrice: data["shopDetails"]["Min Free Delivery Price"]
        },
        addressData: {
            mainAddress: data["shopDetails"]["Main Address"],
            latitude: data["shopDetails"]["Latitude"],
            longitude: data["shopDetails"]["Longitude"]
        },
        menuItemsID: shopItem._id,
        phoneNO: data["shopDetails"]["Phone No"],
        shopType: data["shopDetails"]["ShopType"],
        bannerImage: data["shopDetails"]["BannerImage"]
    })

    await shop.save();
    
    console.log("Shop Inserted")

    return true;
}


module.exports = insertItem;