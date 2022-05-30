const express = require('express');
const router = express.Router();
const DSDB = require('../../util/localDB/localDB')

router.post('/sathi/location/location_update',async (req,res)=>{

    const action = req.query.action;

    //  decide weather to insert or delete from the memory
    
    await DSDB.pushDeliveryBoys('deliverySathis',req.body,action);

    const deliverySathis = await DSDB.get('deliverySathis');
    console.log(deliverySathis);

    res.json({
        success: true
    });
})

module.exports = router;