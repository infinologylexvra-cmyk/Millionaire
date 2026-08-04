const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');

const createCoupon = require('../../controllers/coupons/createCoupon');
const getCoupons = require('../../controllers/coupons/getCoupons');
const validateCoupon = require('../../controllers/coupons/validateCoupon');
const updateCoupon = require('../../controllers/coupons/updateCoupon');
const deleteCoupon = require('../../controllers/coupons/deleteCoupon');

router.post('/validate', protect, validateCoupon);
router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
