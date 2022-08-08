const express = require('express');
const router = express.Router();
const client = require('../../util/init_redis')

router.post('/sathi/location/location_update',async (req,res)=>{

    const action = req.query.action;
    const data = req.body

    let deliverySathis = await client.get("deliverySathis");
    if(deliverySathis == null) deliverySathis = {}
    else deliverySathis = JSON.parse(deliverySathis)

    if(action == "del"){
        delete deliverySathis[data.phoneNo]
    }
    else {
        deliverySathis[data.phoneNo] = data;
    }

    await client.set("deliverySathis",JSON.stringify(deliverySathis))

    // await DSDB.pushDeliveryBoys('deliverySathis',req.body,action);

    // const deliverySathis = await DSDB.get('deliverySathis');
    // console.log(deliverySathis);

    res.json({
        success: true
    });
})

module.exports = router;