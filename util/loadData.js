const csv=require('csvtojson');


async function getDataFromCSV(path){
    const rawData = await csv({noheader:true}).fromFile(path);

    const shopDetails = {};
    // First Nine Lines Conains Data Of The Shop
    for(let i=0;i<11;i++){
        shopDetails[rawData[i]["field1"]] = rawData[i]["field2"];
    }


    let noOfItems = parseInt(rawData[12]["field2"]);

    let i = 14;
    const categories = {};

    while(noOfItems--){
        const shopItem = {};

        shopItem["name"] = rawData[i]["field1"];
        shopItem["imageURL"] = rawData[i]["field2"];
        shopItem["isVeg"] = rawData[i]["field4"] == "TRUE" ? true : false;

        shopItem["discount"] = rawData[i]["field5"];
        shopItem["taxOrPackigingPrice"] = rawData[i]["field6"];

        const categoryName = rawData[i]["field3"];
        i = i + 1;

        let priceItemsCount = parseInt(rawData[i]["field2"]);
        const pricings = [];

        i = i + 1;
        while(priceItemsCount--){
            i = i + 1;
            const eachPricing = {};
            eachPricing["type"] = rawData[i]["field1"];
            eachPricing["price"] = rawData[i]["field2"];
            // eachPricing["isVeg"] = rawData[i]["field2"]

            pricings.push(eachPricing);
        }

        shopItem["pricings"] = pricings;
 
        if(categories[categoryName] == null){
            categories[categoryName] = [shopItem];
        }
        else {
            categories[categoryName].push(shopItem);
        }

        i = i + 2;

    }

    return {categories: reFormatData(categories),shopDetails: shopDetails};
}

function reFormatData(data){
    let formatedData = [];
    for(let key in data){
        formatedData.push({categoryName : key,shopItemDataList: data[key]});
    }
    return formatedData;
}


module.exports = getDataFromCSV;
