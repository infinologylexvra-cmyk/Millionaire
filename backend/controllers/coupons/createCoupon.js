const Coupon = require('../../models/Coupon');
const { success, error } = require('../../helpers/response');

const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      expiryDate,
    } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return error(res, 409, 'Coupon code already exists');
    }

    const coupon = await Coupon.create({
      code,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      expiryDate,
    });

    return success(res, 201, 'Coupon created successfully', coupon);
  } catch (err) {
    next(err);
  }
};

module.exports = createCoupon;
