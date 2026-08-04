const Review = require('../../models/Review');
const { success } = require('../../helpers/response');

const createReview = async (req, res, next) => {
  try {
    const { rating, comment, role, number } = req.body;

    const review = await Review.create({
      user: req.user._id,
      name: req.user.name,
      role,
      rating,
      comment,
      number,
      isApproved: false,
    });

    return success(
      res,
      201,
      'Thank you! Your review has been submitted and is pending approval.',
      review
    );
  } catch (err) {
    next(err);
  }
};

module.exports = createReview;
