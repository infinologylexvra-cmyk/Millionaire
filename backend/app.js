const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth/authRoutes');
const numberRoutes = require('./routes/numbers/numberRoutes');
const categoryRoutes = require('./routes/categories/categoryRoutes');
const orderRoutes = require('./routes/orders/orderRoutes');
const paymentRoutes = require('./routes/payments/paymentRoutes');
const couponRoutes = require('./routes/coupons/couponRoutes');
const userRoutes = require('./routes/users/userRoutes');
const reviewRoutes = require('./routes/reviews/reviewRoutes');
const contactRoutes = require('./routes/contact/contactRoutes');
const settingsRoutes = require('./routes/settings/settingsRoutes');
const dashboardRoutes = require('./routes/dashboard/dashboardRoutes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = [
  'http://localhost:5173',
  'https://millionaire-d2gp.onrender.com',
    'https://www.millionaire-numbers.in',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((o) => o.trim()) : [])
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(hpp());
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Millionaire Numbers API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/numbers', numberRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
