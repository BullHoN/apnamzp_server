const express = require('express')
const router = express.Router()
const client = require('../../util/init_redis')

router.post('/apna_mzp/admin/service-status', async (req,res,next)=>{
    try {
        await client.set("serviceStatus",JSON.stringify(req.body))
        res.json({
            success: true
        })
    }
    catch(err){
        next(err)
    }
})

module.exports = router