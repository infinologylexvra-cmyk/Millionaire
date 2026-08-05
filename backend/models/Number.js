const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
      index: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    operator: {
      type: String,
      enum: ['Jio', 'Airtel', 'Vi', 'BSNL'],
      required: true,
    },
    circle: {
      type: String,
      required: true,
      default: 'All India',
    },
    pattern: {
      type: String,
      enum: ['VIP', 'Fancy', 'Gold', 'Silver', 'Platinum', 'Business', 'Wedding', 'Trending'],
      required: true,
    },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    originalPrice: { type: Number, min: 0, default: 0 },
    description: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    digitSum: { type: Number },
    isFeatured: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    isReserved: { type: Boolean, default: false },
    reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reservedAt: { type: Date },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    soldAt: { type: Date },
  },
  { timestamps: true }
);

numberSchema.index({ price: 1 });
numberSchema.index({ pattern: 1, operator: 1, isSold: 1, isActive: 1 });
numberSchema.index({ phoneNumber: 'text', description: 'text', tags: 'text' });

numberSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

numberSchema.set('toJSON', { virtuals: true });
numberSchema.set('toObject', { virtuals: true });

numberSchema.pre('validate', function () {
  if (this.phoneNumber) {
    this.digitSum = this.phoneNumber
      .toString()
      .split('')
      .reduce((sum, d) => sum + Number(d), 0);
  }
});

module.exports = mongoose.model('Number', numberSchema);
