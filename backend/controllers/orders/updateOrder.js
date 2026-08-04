const Order = require('../../models/Order');
const { success, error } = require('../../helpers/response');

const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return error(res, 404, 'Order not found');
    }

    order.orderStatus = orderStatus;
    order.statusHistory.push({ status: orderStatus, note });
    await order.save();

    return success(res, 200, 'Order updated successfully', order);
  } catch (err) {
    next(err);
  }
};

module.exports = updateOrder;
