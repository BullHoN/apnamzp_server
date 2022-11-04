const client = require('../../util/init_redis')

const bannerImagesDefault = [
    {
        "imageURL":"https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/Untitled-1+(4).png",
    }
]

const pickAndDropDefaultDetails = {
    "pricings":  "Rs. 30 per store within 3KM and after 3KM, additional Rs.10 per KM",
    "carriablesImage": [{"imageURL":"https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/SECOND+POSTER+(4)+(1).png"}]
}
  
const defaultStatus = {
    serviceOpen: false,
    message: "Service is Currently Unavailable",
    type: "rain"  // [close, rain, occasion]
}


module.exports = {

    getBannerImages: async (req,res,next) => {
        try{
            let bannerImages = await client.get("bannerImages")
            if(bannerImages == null) await client.set("bannerImages",JSON.stringify(bannerImagesDefault),{
                'EX': 365 * 24 * 60 * 60
            })
            else bannerImages = JSON.parse(bannerImages)
    
            res.json(bannerImages || bannerImagesDefault)
        }
        catch(err){
            next(err)
        }
    },

    getPickupAndDropDetails: async (req,res,next) => {
        try{
            let pickAndDropDetails = await client.get("pickAndDropDetails")
            if(pickAndDropDetails == null) await client.set("pickAndDropDetails",JSON.stringify(pickAndDropDefaultDetails),{
                'EX': 365 * 24 * 60 * 60
            })
            else pickAndDropDetails = JSON.parse(pickAndDropDetails)
    
            res.json((pickAndDropDetails || pickAndDropDefaultDetails))
        }
        catch(err){
            next(err)
        }
    },

    getServiceStatus: async (req,res,next) => {
        try {
            let serviceStatus = await client.get("serviceStatus")
            if (serviceStatus) serviceStatus = JSON.parse(serviceStatus)
            else await client.set("serviceStatus",JSON.stringify(defaultStatus))
    
            res.json(serviceStatus || defaultStatus)
        }
        catch(err){
            next(err)
        }
    }

}