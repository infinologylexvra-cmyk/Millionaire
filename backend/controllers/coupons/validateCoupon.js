const Coupon = require('../../models/Coupon');
const { success, error } = require('../../helpers/response');

const validateCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return error(res, 404, 'Invalid coupon code');
    }

    const { valid, reason } = coupon.isValid(amount);
    if (!valid) {
      return error(res, 400, reason);
    }

    const discount = coupon.calculateDiscount(amount);

    return success(res, 200, 'Coupon applied successfully', {
      code: coupon.code,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      finalAmount: amount - discount,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = validateCoupon;
