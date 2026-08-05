const Order = require('../../models/Order');
const { success, error } = require('../../helpers/response');
const upload = require('../../middleware/upload');

/**
 * POST /api/orders/:id/submit-payment
 * User submits UTR number or screenshot after paying via UPI
 */
const submitPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return error(res, 404, 'Order not found');

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return error(res, 403, 'Not authorized');
    }

    const { utrNumber } = req.body;

    if (req.file) {
      order.paymentScreenshot = req.file.path;
      order.paymentVerificationStatus = 'screenshot_uploaded';
    } else if (utrNumber) {
      order.utrNumber = utrNumber;
      order.paymentVerificationStatus = 'utr_submitted';
    } else {
      return error(res, 400, 'Please provide UTR number or screenshot');
    }

    order.orderStatus = 'processing';
    order.statusHistory.push({ status: 'processing', note: 'Payment submitted, awaiting admin verification' });
    await order.save();

    return success(res, 200, 'Payment details submitted successfully', order);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/orders/:id/verify-payment
 * Admin approves or rejects a submitted payment
 */
const verifyPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return error(res, 404, 'Order not found');

    const { action } = req.body; // 'approve' | 'reject'

    if (action === 'approve') {
      order.paymentVerificationStatus = 'approved';
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.statusHistory.push({ status: 'confirmed', note: 'Payment approved by admin' });

      // Mark all numbers in this order as sold (removes them from store)
      const NumberModel = require('../../models/Number');
      for (const item of order.items) {
        const numId = item.number || item._id;
        if (numId) {
          await NumberModel.findByIdAndUpdate(numId, {
            isSold: true,
            isReserved: false,
            soldTo: order.user,
            soldAt: new Date(),
          });
        }
      }
    } else if (action === 'reject') {
      order.paymentVerificationStatus = 'rejected';
      order.paymentStatus = 'failed';
      order.orderStatus = 'pending';
      order.statusHistory.push({ status: 'pending', note: 'Payment rejected by admin - please re-submit' });

      // Release reserved numbers
      const NumberModel = require('../../models/Number');
      for (const item of order.items) {
        const numId = item.number || item._id;
        if (numId) {
          await NumberModel.findByIdAndUpdate(numId, {
            isReserved: false,
            reservedBy: null,
          });
        }
      }
    } else {
      return error(res, 400, 'Invalid action. Use "approve" or "reject"');
    }

    await order.save();
    return success(res, 200, `Payment ${action}d successfully`, order);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitPayment, verifyPayment };
