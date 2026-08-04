const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Number = require('../models/Number');
const Settings = require('../models/Settings');
const Category = require('../models/Category');

dotenv.config({ path: '../.env' });

const numbers = [
  '9087500010', '9047500020', '9097500020', '9017500030', 
  '9037500030', '9087800030', '9060600030', '9050500030', 
  '9055500030', '9047400030', '9036300030', '9042400030', 
  '9065600040', '9012300060', '9012100080', '9012400070', 
  '9032300099', '9024800055', '9054700032', '9036900088', 
  '9031300099', '9023100010', '9089700011', '9079600088'
];

const prices = [899, 2499, 2799, 4999, 6999, 11999];

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Delete existing numbers
    await Number.deleteMany({});
    console.log('All existing numbers deleted.');

    // Fetch or create a category
    let category = await Category.findOne({ name: 'Airtel VIP' });
    if (!category) {
      category = await Category.create({ name: 'Airtel VIP', slug: 'airtel-vip', description: 'Exclusive Airtel Numbers', isActive: true });
    }

    // Insert new numbers
    const newNumbers = numbers.map(num => {
      const price = prices[Math.floor(Math.random() * prices.length)];
      return {
        phoneNumber: num,
        price: price,
        status: 'available',
        category: category._id,
        operator: 'Airtel',
        pattern: 'VIP',
        isFeatured: Math.random() > 0.5,
        sumTotal: num.split('').reduce((acc, curr) => acc + parseInt(curr), 0)
      };
    });

    await Number.insertMany(newNumbers);
    console.log(`Inserted ${newNumbers.length} new numbers.`);

    // Update settings
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    settings.whatsappNumber = '+919888695199';
    settings.upiId = 'yespay.mabs1467858wkit0263@yesbankltd';
    settings.upiName = 'VELTRIX LABS';
    settings.qrCodeImage = ''; // Clear image to rely on QR code generation component

    await settings.save();
    console.log('Settings updated with new WhatsApp and UPI ID.');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

runMigration();
