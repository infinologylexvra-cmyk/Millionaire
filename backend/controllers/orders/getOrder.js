const Order = require('../../models/Order');
const { success, error } = require('../../helpers/response');

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.number');

    if (!order) {
      return error(res, 404, 'Order not found');
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return error(res, 403, 'Not authorized to view this order');
    }

    return success(res, 200, 'Order fetched', order);
  } catch (err) {
    next(err);
  }
};

module.exports = getOrder;
