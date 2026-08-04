const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function (purchaseAmount = 0) {
  if (!this.isActive) return { valid: false, reason: 'Coupon is inactive' };
  if (new Date() > new Date(this.expiryDate)) return { valid: false, reason: 'Coupon has expired' };
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit)
    return { valid: false, reason: 'Coupon usage limit reached' };
  if (purchaseAmount < this.minPurchase)
    return { valid: false, reason: `Minimum purchase of Rs. ${this.minPurchase} required` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (amount) {
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    if (this.maxDiscount) discount = Math.min(discount, this.maxDiscount);
  } else {
    discount = this.discountValue;
  }
  return Math.min(Math.round(discount), amount);
};

module.exports = mongoose.model('Coupon', couponSchema);
