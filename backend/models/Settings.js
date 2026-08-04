const mongoose = require('mongoose');

/**
 * Singleton-style settings document (only one document should ever exist)
 */
const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Millionaire Numbers' },
    tagline: { type: String, default: 'Exclusive Numbers, Exclusive You' },
    supportEmail: { type: String, default: 'hello@millionairenumbers.in' },
    supportPhone: { type: String, default: '+91 98765 43210' },
    whatsappNumber: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: 'Mumbai, Maharashtra, India' },
    upiId: { type: String, default: '' },
    upiName: { type: String, default: '' },
    qrCodeUrl: { type: String, default: '' },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    stats: {
      trustedCustomers: { type: Number, default: 50000 },
      averageRating: { type: Number, default: 4.9 },
      numbersSold: { type: Number, default: 12500 },
      citiesCovered: { type: Number, default: 250 },
    },
    seo: {
      metaTitle: { type: String, default: 'Millionaire Numbers - Exclusive VIP Mobile Numbers in India' },
      metaDescription: {
        type: String,
        default: 'Buy exclusive VIP, fancy and premium mobile numbers across India. Verified sellers, secure payments, doorstep delivery.',
      },
    },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
