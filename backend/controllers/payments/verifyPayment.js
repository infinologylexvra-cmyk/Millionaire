const Order = require('../../models/Order');
const NumberModel = require('../../models/Number');
const Coupon = require('../../models/Coupon');
const { success, error } = require('../../helpers/response');
const { verifyRazorpaySignature } = require('../../services/paymentService');
const { sendOrderConfirmationEmail } = require('../../services/emailService');

const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return error(res, 404, 'Order not found');
    }

    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return error(res, 403, 'Not authorized to verify this order');
    }

    const isValid = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      order.paymentStatus = 'failed';
      await order.save();
      return error(res, 400, 'Payment verification failed');
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.statusHistory.push({ status: 'confirmed', note: 'Payment verified' });
    await order.save();

    await NumberModel.updateMany(
      { _id: { $in: order.items.map((i) => i.number) } },
      { isSold: true, soldTo: order.user, soldAt: new Date() }
    );

    if (order.coupon) {
      await Coupon.findByIdAndUpdate(order.coupon, { $inc: { usedCount: 1 } });
    }

    sendOrderConfirmationEmail(order.customerDetails.email, order).catch(() => {});

    return success(res, 200, 'Payment verified successfully', order);
  } catch (err) {
    next(err);
  }
};

module.exports = verifyPayment;
