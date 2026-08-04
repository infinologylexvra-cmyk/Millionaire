const Coupon = require('../../models/Coupon');
const { success } = require('../../helpers/response');

const getCoupons = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.isActive === 'true') filter.isActive = true;
    if (req.query.isActive === 'false') filter.isActive = false;

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    return success(res, 200, 'Coupons fetched', coupons);
  } catch (err) {
    next(err);
  }
};

module.exports = getCoupons;
