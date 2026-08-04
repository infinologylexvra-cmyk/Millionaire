/**
 * Seed script - populates categories, numbers, settings, an admin user and sample reviews.
 * Run with: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Category = require('./models/Category');
const NumberModel = require('./models/Number');
const Settings = require('./models/Settings');
const Review = require('./models/Review');
const Coupon = require('./models/Coupon');

const categoriesData = [
  { name: 'VIP Numbers', icon: 'crown', description: 'The rarest, most sought-after digit sequences in India.', startingPrice: 75000, order: 1, isFeatured: true },
  { name: 'Fancy Numbers', icon: 'sparkle', description: 'Memorable repeating and mirror-digit patterns.', startingPrice: 15000, order: 2, isFeatured: true },
  { name: 'Gold Numbers', icon: 'diamond', description: 'Premium sequences for those who stand out.', startingPrice: 25000, order: 3, isFeatured: true },
  { name: 'Silver Numbers', icon: 'star', description: 'Elegant, easy-to-remember numbers at accessible prices.', startingPrice: 5000, order: 4, isFeatured: false },
  { name: 'Platinum Numbers', icon: 'gem', description: 'Ultra-premium numbers reserved for the elite.', startingPrice: 150000, order: 5, isFeatured: true },
  { name: 'Business Numbers', icon: 'briefcase', description: "Numbers that build instant trust for your brand.", startingPrice: 20000, order: 6, isFeatured: false },
  { name: 'Wedding Numbers', icon: 'heart', description: 'Auspicious numbers to celebrate new beginnings.', startingPrice: 10000, order: 7, isFeatured: false },
  { name: 'Trending Numbers', icon: 'trending', description: "This week's most-viewed exclusive numbers.", startingPrice: 12000, order: 8, isFeatured: true },
];

const operators = ['Jio', 'Airtel', 'Vi', 'BSNL'];
const circles = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'All India'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildNumber = (patternDigits, prefix = '9') => {
  let n = prefix;
  while (n.length < 10) n += randomFrom(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
  return (prefix + patternDigits).slice(0, 10).padEnd(10, randomFrom(['1', '2', '3']));
};

// Hand-curated realistic-looking premium number patterns per category
const numberPool = {
  'VIP Numbers': [
    '9999900001', '9999911111', '9888800002', '9777700003', '9999955555',
  ],
  'Fancy Numbers': [
    '9898989898', '9191919191', '9797979797', '9090909090', '9696969696',
  ],
  'Gold Numbers': [
    '9123456789', '9234567890', '9812345678', '9765432109', '9345678912',
  ],
  'Silver Numbers': [
    '9811122233', '9822233344', '9833344455', '9844455566', '9855566677',
  ],
  'Platinum Numbers': [
    '9999000001', '9888000002', '9777000003', '9999888888', '9666000004',
  ],
  'Business Numbers': [
    '9900112233', '9911223344', '9922334455', '9933445566', '9944556677',
  ],
  'Wedding Numbers': [
    '9955667788', '9966778899', '9977889900', '9988990011', '9911992233',
  ],
  'Trending Numbers': [
    '9871234321', '9639639639', '9258525852', '9147147147', '9632963296',
  ],
};

const pricingByCategory = {
  'VIP Numbers': [75000, 250000],
  'Fancy Numbers': [15000, 40000],
  'Gold Numbers': [25000, 60000],
  'Silver Numbers': [5000, 12000],
  'Platinum Numbers': [150000, 500000],
  'Business Numbers': [20000, 45000],
  'Wedding Numbers': [10000, 22000],
  'Trending Numbers': [12000, 30000],
};

const patternMap = {
  'VIP Numbers': 'VIP',
  'Fancy Numbers': 'Fancy',
  'Gold Numbers': 'Gold',
  'Silver Numbers': 'Silver',
  'Platinum Numbers': 'Platinum',
  'Business Numbers': 'Business',
  'Wedding Numbers': 'Wedding',
  'Trending Numbers': 'Trending',
};

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    Category.deleteMany({}),
    NumberModel.deleteMany({}),
    Review.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  console.log('Seeding admin user...');
  let admin = await User.findOne({ email: 'admin@millionairenumbers.in' });
  if (!admin) {
    admin = await User.create({
      name: 'Millionaire Admin',
      email: 'admin@millionairenumbers.in',
      password: 'Admin@12345',
      role: 'admin',
      isVerified: true,
      authProvider: 'local',
      phone: '9999900000',
    });
  }

  console.log('Seeding demo customer...');
  let demoUser = await User.findOne({ email: 'demo@millionairenumbers.in' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Rohan Mehta',
      email: 'demo@millionairenumbers.in',
      password: 'Demo@12345',
      role: 'user',
      isVerified: true,
      authProvider: 'local',
      phone: '9812300000',
    });
  }

  console.log('Seeding categories...');
  const categories = await Category.insertMany(categoriesData);
  const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  console.log('Seeding numbers...');
  const numbersToInsert = [];
  Object.entries(numberPool).forEach(([catName, phoneNumbers]) => {
    const [minPrice, maxPrice] = pricingByCategory[catName];
    phoneNumbers.forEach((phoneNumber, idx) => {
      const price = Math.round((minPrice + Math.random() * (maxPrice - minPrice)) / 500) * 500;
      const originalPrice = Math.round(price * (1.15 + Math.random() * 0.25) / 500) * 500;
      numbersToInsert.push({
        phoneNumber,
        category: categoryByName[catName]._id,
        operator: randomFrom(operators),
        circle: randomFrom(circles),
        pattern: patternMap[catName],
        price,
        originalPrice,
        description: `An exclusive ${patternMap[catName].toLowerCase()} number with a rare digit sequence. Comes with free SIM delivery and porting assistance anywhere in India.`,
        tags: [patternMap[catName].toLowerCase(), 'premium', 'india'],
        isFeatured: idx < 2,
        views: Math.floor(Math.random() * 500),
      });
    });
  });
  await NumberModel.insertMany(numbersToInsert);

  console.log('Seeding settings...');
  await Settings.deleteMany({});
  await Settings.create({});

  console.log('Seeding reviews...');
  await Review.insertMany([
    {
      user: demoUser._id,
      name: 'Rohan Mehta',
      role: 'Entrepreneur, Mumbai',
      rating: 5,
      comment: 'Got my VIP number delivered within a day of porting approval. The entire process felt premium from checkout to doorstep delivery.',
      isApproved: true,
      isFeatured: true,
    },
    {
      user: demoUser._id,
      name: 'Ananya Sharma',
      role: 'Real Estate Broker, Delhi',
      rating: 5,
      comment: 'Clients remember my number instantly now. Millionaire Numbers made the whole switch effortless and completely secure.',
      isApproved: true,
      isFeatured: true,
    },
    {
      user: demoUser._id,
      name: 'Vikram Singh',
      role: 'Film Producer, Mumbai',
      rating: 4,
      comment: 'Excellent inventory of fancy numbers. Support team helped me through the porting paperwork end-to-end.',
      isApproved: true,
      isFeatured: true,
    },
    {
      user: demoUser._id,
      name: 'Priya Nair',
      role: 'Boutique Owner, Bangalore',
      rating: 5,
      comment: 'Bought a wedding-special number for my husband as a surprise gift. Beautifully simple experience, highly recommend!',
      isApproved: true,
      isFeatured: true,
    },
  ]);

  console.log('Seeding coupon...');
  await Coupon.create({
    code: 'WELCOME10',
    description: 'Flat 10% off on your first premium number',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 5000,
    maxDiscount: 10000,
    usageLimit: 500,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });

  console.log('\nSeed complete!');
  console.log('Admin login -> admin@millionairenumbers.in / Admin@12345');
  console.log('Demo user login -> demo@millionairenumbers.in / Demo@12345');
  console.log(`Categories: ${categories.length}, Numbers: ${numbersToInsert.length}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
