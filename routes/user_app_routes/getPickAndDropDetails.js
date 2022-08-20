const express = require('express')
const router = express.Router()
const client = require('../../util/init_redis')

const pickAndDropDefaultDetails = {
  "pricings":  "Rs. 30 per store within 3KM and after 3KM, additional Rs.10 per KM",
  "carriablesImage": [{"imageURL":"https://apna-mzp-assests.s3.ap-south-1.amazonaws.com/SECOND+POSTER+(4)+(1).png"}]
}

router.get('/user/pickAndDropDetails', async (req,res,next)=>{

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
})

module.exports = router