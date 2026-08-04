const Review = require('../../models/Review');
const { success, error } = require('../../helpers/response');

const approveReview = async (req, res, next) => {
  try {
    const { isFeatured } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, ...(isFeatured !== undefined ? { isFeatured } : {}) },
      { new: true }
    );

    if (!review) {
      return error(res, 404, 'Review not found');
    }

    return success(res, 200, 'Review approved successfully', review);
  } catch (err) {
    next(err);
  }
};

module.exports = approveReview;
