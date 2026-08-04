const Razorpay = require('razorpay');

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn('Razorpay keys are not configured. Payment routes will fail until RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are set in .env');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
    });
  }
  return razorpayInstance;
};

module.exports = getRazorpay;
