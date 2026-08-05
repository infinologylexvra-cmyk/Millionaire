const Order = require('../../models/Order');
const { success } = require('../../helpers/response');
const { getPagination, buildPaginationMeta } = require('../../helpers/pagination');

const getOrders = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 10);
    const { status, paymentStatus } = req.query;

    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return success(res, 200, 'Orders fetched', orders, {
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getOrders;
