const express = require('express')
const router = express.Router()
const animation = require('../../animation/animation.json')
const animation2 = require('../../animation/animation2.json')

router.get('/user/banner-animation', async (req,res,next)=>{
    try {
        res.json(animation)
    }
    catch(err){
        next(err)
    }
})


module.exports = router;