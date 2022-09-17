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
                this.data.set(shop.name.toLowerCase(),shopString)
                this.shopReference.set(shop.name.toLowerCase(),shop);
            })
        })
    }

    searchInDB(query){
        let results = [];
        for(let key of this.data.keys()){
            const regex = new RegExp(query);
            if(key.includes(query) || this.data.get(key).includes(query)){
                results.push(this.shopReference.get(key));
            }

        }

        results.sort(function (a,b){
            if(a.isOpen && b.isOpen){
                return b.averageRatings - a.averageRatings
            }
            
            if(a.isOpen){
                return -1
            }

            if(b.isOpen){
                return 1
            }

            return 0
        })

        return results;
    }

    updateShopStatus(shop){
        const shopName = shop.name.toLowerCase()
        this.shopReference.delete(shopName)
        this.shopReference.set(shopName,shop);
    }

}

module.exports = new SearchDB();