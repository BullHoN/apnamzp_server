const Shop = require('../models/Shop');
const ShopItem = require('../models/ShopItem');


class SearchDB{

    loadData(){
        this.data = new Map();
        this.shopReference = new Map();

        Shop.find().then(shops => {
            shops.forEach(async (shop)=>{
                const shopMenuItems = await ShopItem.findOne({_id: shop.menuItemsID});
                let shopString = "";
                shopMenuItems.categories.forEach((category)=>{
                    category.shopItemDataList.forEach(menuitem => {
                        shopString += menuitem.name.toLowerCase();
                    })
                })
                this.data.set(shop.name,shopString)
                this.shopReference.set(shop.name,shop);
            })
        })
    }

    searchInDB(query){
        let results = [];
        for(let key of this.data.keys()){
            const regex = new RegExp(query);
            
            if(key.match(regex) || this.data.get(key).match(regex)){
                results.push(this.shopReference.get(key));
            }

        }
        return results;
    }

}

module.exports = new SearchDB();