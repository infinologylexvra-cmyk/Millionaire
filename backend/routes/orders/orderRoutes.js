const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { validate, createOrderValidation } = require('../../validations/orderValidation');

const createOrder = require('../../controllers/orders/createOrder');
const getOrders = require('../../controllers/orders/getOrders');
const getOrder = require('../../controllers/orders/getOrder');
const updateOrder = require('../../controllers/orders/updateOrder');
const cancelOrder = require('../../controllers/orders/cancelOrder');
const { submitPayment, verifyPayment } = require('../../controllers/orders/paymentVerification');
const upload = require('../../middleware/upload');

router.post('/', protect, createOrderValidation, validate, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, admin, updateOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.post('/:id/submit-payment', protect, upload.single('screenshot'), submitPayment);
router.put('/:id/verify-payment', protect, admin, verifyPayment);

module.exports = router;
