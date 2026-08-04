const Order = require('../../models/Order');
const NumberModel = require('../../models/Number');
const { success, error } = require('../../helpers/response');
const { refundRazorpayPayment } = require('../../services/paymentService');

const refundPayment = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return error(res, 404, 'Order not found');
    }

    if (order.paymentStatus !== 'paid' || !order.razorpayPaymentId) {
      return error(res, 400, 'Order is not eligible for refund');
    }

    await refundRazorpayPayment(order.razorpayPaymentId, amount);

    order.paymentStatus = 'refunded';
    order.statusHistory.push({ status: 'refunded', note: 'Payment refunded' });
    await order.save();

    await NumberModel.updateMany(
      { _id: { $in: order.items.map((i) => i.number) } },
      { isSold: false, soldTo: null, soldAt: null }
    );

    return success(res, 200, 'Payment refunded successfully', order);
  } catch (err) {
    next(err);
  }
};

module.exports = refundPayment;
