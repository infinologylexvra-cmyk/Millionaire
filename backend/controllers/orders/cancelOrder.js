const Order = require('../../models/Order');
const { success, error } = require('../../helpers/response');

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return error(res, 404, 'Order not found');
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return error(res, 403, 'Not authorized to cancel this order');
    }

    if (order.paymentStatus === 'paid') {
      return error(res, 400, 'Paid orders cannot be self-cancelled. Please contact support for a refund.');
    }

    order.orderStatus = 'cancelled';
    order.cancelReason = req.body.reason || 'Cancelled by user';
    order.statusHistory.push({ status: 'cancelled', note: order.cancelReason });
    await order.save();

    return success(res, 200, 'Order cancelled successfully', order);
  } catch (err) {
    next(err);
  }
};

module.exports = cancelOrder;
