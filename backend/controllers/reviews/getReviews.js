const Review = require('../../models/Review');
const { success } = require('../../helpers/response');

const getReviews = async (req, res, next) => {
  try {
    const { featured, all } = req.query;

    const filter = {};
    const isAdmin = req.user && req.user.role === 'admin';
    if (!(isAdmin && all === 'true')) {
      filter.isApproved = true;
    }
    if (featured === 'true') filter.isFeatured = true;

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(limit);

    return success(res, 200, 'Reviews fetched', reviews);
  } catch (err) {
    next(err);
  }
};

module.exports = getReviews;
