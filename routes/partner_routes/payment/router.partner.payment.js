const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/partner/partner.payment.controller')

router.post('/subscription-payment-id', controller.getSubscriptionPaymentId)

router.post('/checkout', controller.subscriptionCheckout)


module.exports = router