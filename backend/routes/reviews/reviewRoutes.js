const express = require('express');
const router = express.Router();

const { protect, optionalAuth } = require('../../middleware/auth');
const admin = require('../../middleware/admin');

const getReviews = require('../../controllers/reviews/getReviews');
const createReview = require('../../controllers/reviews/createReview');
const approveReview = require('../../controllers/reviews/approveReview');
const deleteReview = require('../../controllers/reviews/deleteReview');

router.get('/', optionalAuth, getReviews);
router.post('/', protect, createReview);
router.put('/:id/approve', protect, admin, approveReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
