const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/partner/partner.subscription.controller')

router.get('/banner_images', controller.getSubscriptionBanner)
router.get('/:shopId', controller.getActiveSubscription)

module.exports = router