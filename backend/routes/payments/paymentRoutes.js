const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');

const createOrder = require('../../controllers/payments/createOrder');
const verifyPayment = require('../../controllers/payments/verifyPayment');
const refundPayment = require('../../controllers/payments/refundPayment');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/refund', protect, admin, refundPayment);

module.exports = router;
