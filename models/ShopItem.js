const mongoose = require('mongoose');

const pricingsSchema = new mongoose.Schema({
    type: String,
    price: String
})

const shopItemSchema = new mongoose.Schema({
    categories:[
        {
            categoryName: String,
            shopItemDataList: [
                {
                    name: String,
                    imageURL: String,
                    isVeg: Boolean,
                    pricings:[pricingsSchema],
                    taxOrPackigingPrice: {
                        type: String,
                        default: "0"
                    },
                    discount: {
                        type: String,
                        default: "0"
                    },
                    available: {
                        type: Boolean,
                        default: true
                    },
                    availableTimings: {
                        from: String,
                        to: String
                    },
                    isBestSeller: {
                        type: Boolean,
                        default: false
                    }
                }
            ]
        }
    ]
})


const ShopMenuItem = mongoose.model('ShopMenuItem',shopItemSchema);
module.exports = ShopMenuItem;