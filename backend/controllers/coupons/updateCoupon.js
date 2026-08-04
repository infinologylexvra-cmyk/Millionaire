const Coupon = require('../../models/Coupon');
const { success, error } = require('../../helpers/response');

const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return error(res, 404, 'Coupon not found');
    }

    return success(res, 200, 'Coupon updated successfully', coupon);
  } catch (err) {
    next(err);
  }
};

module.exports = updateCoupon;
