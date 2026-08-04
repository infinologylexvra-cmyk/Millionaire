const Order = require('../../models/Order');
const { success, error } = require('../../helpers/response');
const { createRazorpayOrder } = require('../../services/paymentService');

const createOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return error(res, 404, 'Order not found');
    }

    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return error(res, 403, 'Not authorized to pay for this order');
    }

    if (order.paymentStatus === 'paid') {
      return error(res, 400, 'Order is already paid');
    }

    const razorpayOrder = await createRazorpayOrder(order.totalAmount, order.orderNumber);

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return success(res, 200, 'Razorpay order created', {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
      orderNumber: order.orderNumber,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createOrder;
