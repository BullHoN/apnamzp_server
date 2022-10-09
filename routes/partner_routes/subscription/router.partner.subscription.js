const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/partner/partner.subscription.controller')

router.get('/banner_images', controller.getSubscriptionBanner)

module.exports = router