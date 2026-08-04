const crypto = require('crypto');
const getRazorpay = require('../config/razorpay');

/**
 * Creates a Razorpay order for the given amount (in INR, whole rupees)
 */
const createRazorpayOrder = async (amount, receipt) => {
  const razorpay = getRazorpay();
  const options = {
    amount: Math.round(amount * 100), // paise
    currency: 'INR',
    receipt,
  };
  return razorpay.orders.create(options);
};

/**
 * Verifies the signature returned by Razorpay checkout after payment
 */
const verifyRazorpaySignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder')
    .update(body)
    .digest('hex');
  return expectedSignature === razorpay_signature;
};

const refundRazorpayPayment = async (paymentId, amount) => {
  const razorpay = getRazorpay();
  return razorpay.payments.refund(paymentId, amount ? { amount: Math.round(amount * 100) } : {});
};

module.exports = { createRazorpayOrder, verifyRazorpaySignature, refundRazorpayPayment };
