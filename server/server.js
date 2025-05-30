// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

process.on('uncaughtException', err => {
 console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
 console.log(err.name, err.message);
 process.exit(1);
});

// Always load dotenv for local development, Railway handles production env vars
dotenv.config();

// Debug: Show ALL environment variables
console.log('All environment variables:', Object.keys(process.env));
console.log('JWT_SECRET raw:', process.env.JWT_SECRET);
console.log('MONGO_URI raw:', process.env.MONGO_URI);

// Environment variables check
console.log('Environment check:', { 
 NODE_ENV: process.env.NODE_ENV,
 JWT_SECRET: process.env.JWT_SECRET ? 'Set (length: ' + process.env.JWT_SECRET.length + ')' : 'NOT SET',
 MONGO_URI: process.env.MONGO_URI ? 'Set' : 'NOT SET'
});

// Initialize app
const app = express();

// Trust Railway proxy for rate limiting
app.set('trust proxy', true);

// Import routes - AFTER initializing app
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require('./routes/statsRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorMiddleware');

// Import Counter model for initialization
const Counter = require('./models/Counter');

// CRITICAL: Special handling for Stripe webhooks - must come BEFORE any body parsing middleware
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// MIDDLEWARE SETUP (IN CORRECT ORDER)
// ===================================

// 1. Security HTTP headers
app.use(helmet());

// 2. Development logging
if (process.env.NODE_ENV === 'development') {
 app.use(morgan('dev'));
}

// 3. Request logging for debugging
app.use((req, res, next) => {
 console.log(`${req.method} ${req.originalUrl} - Origin: ${req.headers.origin}`);
 next();
});

// Replace your CORS section in server.js with this:

// 4. CORS Configuration - FINAL WORKING VERSION
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS Origin Check:', origin);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://127.0.0.1:3000',
      'https://brendt-store.vercel.app'
    ];
    
    // Check exact match first
    if (allowedOrigins.includes(origin)) {
      console.log('CORS: Origin allowed (exact match):', origin);
      callback(null, true);
    }
    // Check Vercel pattern
    else if (/^https:\/\/brendt-store.*\.vercel\.app$/.test(origin)) {
      console.log('CORS: Origin allowed (Vercel pattern):', origin);
      callback(null, true);
    }
    else {
      console.log('CORS: Origin BLOCKED:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));


// 5. Body parser - IMPORTANT: This must come BEFORE route handlers
// EXCEPT FOR WEBHOOK ROUTE which needs raw body
app.use(express.json({ limit: '10kb' }));

// 6. Rate limiting
const limiter = rateLimit({
 max: 100,
 windowMs: 60 * 60 * 1000,
 message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// 7. Data sanitization
app.use(mongoSanitize()); // Against NoSQL query injection
app.use(xss()); // Against XSS

// 8. Prevent parameter pollution
app.use(hpp({
 whitelist: [
   'duration',
   'ratingsQuantity',
   'ratingsAverage',
   'maxGroupSize',
   'difficulty',
   'price',
   'category',
   'subcategory'
 ]
}));

// Connect to MongoDB
connectDB();

// Initialize Order Counter when MongoDB connects
mongoose.connection.once('open', async () => {
 try {
   // Initialize the order counter if it doesn't exist
   const counterExists = await Counter.findById('order_number');
   if (!counterExists) {
     await Counter.create({ _id: 'order_number', sequence_value: 0 });
     console.log('Order counter initialized to start from 00001');
   } else {
     console.log('Order counter already exists:', counterExists);
   }
 } catch (error) {
   console.error('Failed to initialize order counter:', error);
 }
});

// Initialize Stripe using environment variable
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51OFY8OKD6oC0E24lRsBz15aZ021IledPq9WQ33NCNOf944Bsa3dd7ItTjjYMDnE290mVJiy1BPF3C3LVOhROelBq00ls0x5qIS';
const stripe = require('stripe')(stripeKey);
// Load payment routes
const paymentRoutes = require('./routes/paymentRoutes');

// ROUTE SETUP - After all middleware
// ==================================
// Add a simple test endpoint
app.get('/api/test', (req, res) => {
 res.json({ message: 'API is working' });
});

// Mount routers
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// 404 handling - for undefined routes
app.all('*', (req, res, next) => {
 next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// SERVER STARTUP
// =============
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
 console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
 console.log('UNHANDLED REJECTION! 💥 Shutting down...');
 console.log(err.name, err.message);
 server.close(() => {
   process.exit(1);
 });
});