const express = require('express')
const router = express.Router()
const client = require('../../util/init_redis')

const defaultStatus = {
    serviceOpen: true,
    message: "Service is Currently Unavailable"
}

router.get('/user/serviceStatus', async (req,res,next)=>{
    try {
        let serviceStatus = await client.get("serviceStatus")
        if (serviceStatus) serviceStatus = JSON.parse(serviceStatus)
        else await client.set("serviceStatus",JSON.stringify(defaultStatus))

        res.json(serviceStatus || defaultStatus)
    }
    catch(err){
        next(err)
    }
})

module.exports = router