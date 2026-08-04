const Coupon = require('../../models/Coupon');
const { success, error } = require('../../helpers/response');

const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return error(res, 404, 'Coupon not found');
    }

    return success(res, 200, 'Coupon deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = deleteCoupon;
