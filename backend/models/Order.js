const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    number: { type: mongoose.Schema.Types.ObjectId, ref: 'Number', required: true },
    phoneNumber: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], validate: (v) => Array.isArray(v) && v.length > 0 },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
    totalAmount: { type: Number, required: true },
    customerDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      idProofType: { type: String, enum: ['Aadhar', 'PAN', 'Passport', 'Voter ID'], default: 'Aadhar' },
    },
    paymentMethod: { type: String, enum: ['upi', 'direct_upi', 'phonepe', 'gpay', 'paytm', 'bhim', 'cod', 'razorpay'], default: 'direct_upi' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'confirmed', 'delivered', 'cancelled'],
      default: 'pending',
    },
    utrNumber: { type: String, default: '' },
    paymentScreenshot: { type: String, default: '' },
    paymentVerificationStatus: {
      type: String,
      enum: ['none', 'screenshot_uploaded', 'utr_submitted', 'approved', 'rejected'],
      default: 'none',
    },
    statusHistory: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
    cancelReason: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre('validate', function () {
  if (!this.orderNumber) {
    this.orderNumber = 'MN' + Date.now().toString().slice(-8) + Math.floor(100 + Math.random() * 900);
  }
});

module.exports = mongoose.model('Order', orderSchema);
