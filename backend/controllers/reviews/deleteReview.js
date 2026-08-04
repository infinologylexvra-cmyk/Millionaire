const Review = require('../../models/Review');
const { success, error } = require('../../helpers/response');

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return error(res, 404, 'Review not found');
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return error(res, 403, 'You are not authorized to delete this review');
    }

    await Review.findByIdAndDelete(req.params.id);

    return success(res, 200, 'Review deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = deleteReview;
