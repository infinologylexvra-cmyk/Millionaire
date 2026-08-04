const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');

const getDashboardStats = require('../../controllers/dashboard/dashboard');
const getAnalytics = require('../../controllers/dashboard/analytics');

router.get('/', protect, admin, getDashboardStats);
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
