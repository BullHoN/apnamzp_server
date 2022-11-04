const Shop = require('../../models/Shop');
const ShopItem = require('../../models/ShopItem');
const httpErrors = require('http-errors')
const SearchDB = require('../../util/searchbarconfig')

module.exports = {

    getCategoryItems: async (req,res,next) => {
        try{
            if(req.params.shopType == "all"){
                const data =  await Shop.find({showShop: true})
                    .sort({isOpen: -1,averageRatings: -1});
                res.json(data);
            }
            else {
                const data =  await Shop.find({shopType: req.params.shopType,showShop: true})
                    .sort({isOpen: -1,averageRatings: -1});
                res.json(data);
            }
        }
        catch(error){
            next(error)
        }
    },

    getShopData: async (req,res,next) => {
        try{
            const shop = await Shop.findOne({_id: req.params.id});
            if(shop == null){
                throw httpErrors.BadRequest("Shop Not Found")
            }

            res.json(shop);
        }
        catch(err){
            next(err)
        }
    },

    getShopItems: async (req,res,next) => {
        try{
            const data = await ShopItem.findOne({_id: req.params.itemsId});

            if(data == null){
                throw httpErrors.BadRequest("Not Found")
            }

            res.json(data["categories"]);
        }
        catch(error){
            next(error)
        }
    },

    searchItems: async (req,res,next) => {
        const query = req.query.query;
    
        try{
            const results = SearchDB.searchInDB(query);
            res.json(results);
        }
        catch(error){
            next(error)
        }
    }

}