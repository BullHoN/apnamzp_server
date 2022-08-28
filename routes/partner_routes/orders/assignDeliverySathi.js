const express = require('express');
const router = express.Router();
const PartnerOrder = require('../../../controllers/partner/partner.order.controller')

router.post('/partner/assignDeliveryBoy', PartnerOrder.assignDeliveryBoy);
router.get('/partner/assignDeliveryBoy', PartnerOrder.assignDeliveryBoy)

module.exports = router;