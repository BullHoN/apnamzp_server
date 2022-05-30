const express = require('express')
const router = express.Router()
const DeliverySathi = require('../../models/DeliverySathi')

router.get('/sathi/info/:phoneNo',async (req,res,next)=>{
    const sathi = await DeliverySathi.findOne({phoneNo: req.params.phoneNo});
    res.json(sathi);
})

module.exports = router;