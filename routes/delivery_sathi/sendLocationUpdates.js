const express = require('express');
const router = express.Router();
const DSDB = require('../../util/localDB/localDB')

router.post('/sathi/location/location_update',async (req,res)=>{
    await DSDB.pushDeliveryBoys('deliverySathis',req.body);

    const deliverySathis = await DSDB.get('deliverySathis');
    console.log(deliverySathis);

    res.json({
        success: true
    });
})

module.exports = router;