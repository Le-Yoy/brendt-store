const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Import Order model for webhook processing
const Order = require('../models/Order');

// Security middleware
const rateLimit = require('express-rate-limit');

// Create rate limiter for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many payment attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validate Stripe configuration
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('CRITICAL ERROR: STRIPE_SECRET_KEY is not set in environment variables');
  throw new Error('Stripe configuration is missing');
}

// Check if we're using the right keys for the environment
const isProduction = process.env.NODE_ENV === 'production';
const isTestKey = stripeKey.startsWith('sk_test_');

if (isProduction && isTestKey) {
  console.error('CRITICAL ERROR: Using TEST Stripe keys in PRODUCTION environment!');
  throw new Error('Invalid Stripe configuration for production');
}

if (!isProduction && !isTestKey) {
  console.warn('WARNING: Using LIVE Stripe keys in DEVELOPMENT environment!');
}

// Initialize Stripe
const stripe = require('stripe')(stripeKey);

// Webhook secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.error('WARNING: STRIPE_WEBHOOK_SECRET is not set - webhooks will not work!');
}

// Client URL for redirects
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

// Log startup configuration
console.log('Stripe Payment Routes Initialized:', {
  environment: process.env.NODE_ENV,
  stripeMode: isTestKey ? 'TEST' : 'LIVE',
  clientUrl: clientUrl,
  webhookConfigured: !!webhookSecret
});

/**
 * @route   POST /api/payments/create-payment-intent
 * @desc    Create a payment intent for Stripe payments
 * @access  Public
 */
router.post('/create-payment-intent', paymentLimiter, async (req, res) => {
  try {
    console.log('Payment intent request received:', {
      amount: req.body.amount,
      currency: req.body.currency,
      orderId: req.body.orderId
    });
    
    const { amount, currency = 'usd', orderId } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount provided' 
      });
    }
    
    // Maximum amount check (adjust based on your business)
    const MAX_AMOUNT_USD = 5000; // $5000 max
    if (amount > MAX_AMOUNT_USD) {
      return res.status(400).json({ 
        error: 'Amount exceeds maximum allowed' 
      });
    }
    
    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      metadata: {
        orderId: orderId || 'direct-payment',
        integration: 'brendt-ecommerce',
        environment: process.env.NODE_ENV
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created successfully:', paymentIntent.id);
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: isProduction ? 'Payment processing error' : error.message
    });
  }
});

/**
 * @route   POST /api/payments/create-checkout-session
 * @desc    Create a checkout session for Stripe Checkout
 * @access  Public
 */
router.post('/create-checkout-session', paymentLimiter, async (req, res) => {
  try {
    console.log('Checkout session request received');
    
    const { madAmount, items, orderId, customerEmail, customerPhone } = req.body;
    
    // Validate required fields
    if (!madAmount || madAmount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount provided' 
      });
    }
    
    // Currency conversion: 1 USD = 9.5 MAD
    const CONVERSION_RATE = 9.5;
    const usdAmount = madAmount / CONVERSION_RATE;
    const roundedUsdAmount = Math.round(usdAmount * 100) / 100;
    
    // Maximum amount check
    const MAX_AMOUNT_MAD = 50000; // 50,000 MAD max
    if (madAmount > MAX_AMOUNT_MAD) {
      return res.status(400).json({ 
        error: 'Amount exceeds maximum allowed' 
      });
    }
    
    console.log('Creating checkout session:', {
      originalMAD: madAmount,
      convertedUSD: roundedUsdAmount,
      orderId: orderId
    });
    
    // Prepare line items
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'BRENDT Order',
          description: items && items.length > 0 
            ? `${items.length} article${items.length > 1 ? 's' : ''}`
            : 'Commande en ligne',
          metadata: {
            madAmount: madAmount.toString()
          }
        },
        unit_amount: Math.round(roundedUsdAmount * 100), // Convert to cents
      },
      quantity: 1,
    }];
    
    // Create session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${clientUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/checkout?canceled=true`,
      metadata: {
        orderId: orderId || `order_${Date.now()}`,
        madAmount: madAmount.toString(),
        environment: process.env.NODE_ENV,
        customerPhone: customerPhone || 'N/A'
      },
      payment_intent_data: {
        metadata: {
          orderId: orderId || `order_${Date.now()}`,
          madAmount: madAmount.toString()
        }
      }
    };
    
    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }
    
    // Set up billing address collection
    sessionConfig.billing_address_collection = 'required';
    
    // Create the session
    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    console.log('Checkout session created successfully:', {
      sessionId: session.id,
      url: session.url.substring(0, 50) + '...'
    });
    
    res.status(200).json({
      url: session.url,
      sessionId: session.id
    });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: isProduction ? 'Payment setup failed' : error.message
    });
  }
});

/**
 * @route   POST /api/payments/webhook
 * @desc    Stripe webhook endpoint for event handling
 * @access  Public (secured by Stripe signature)
 */
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (!webhookSecret) {
    console.error('Webhook secret not configured - rejecting webhook');
    return res.status(500).send('Webhook not configured');
  }

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log(`Webhook event received: ${event.type}`);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    const dataObject = event.data.object;
    
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', dataObject.id);
        
        // Update order status
        if (dataObject.metadata?.orderId) {
          try {
            const order = await Order.findById(dataObject.metadata.orderId);
            if (order) {
              order.isPaid = true;
              order.paidAt = Date.now();
              order.paymentResult = {
                id: dataObject.payment_intent,
                status: 'completed',
                update_time: Date.now(),
                email_address: dataObject.customer_details?.email
              };
              await order.save();
              console.log('Order updated successfully:', order._id);
            }
          } catch (orderError) {
            console.error('Error updating order:', orderError);
          }
        }
        break;
        
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', dataObject.id);
        // Additional payment success handling if needed
        break;
        
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', dataObject.id);
        // Handle failed payment
        break;
        
      case 'checkout.session.expired':
        console.log('Checkout session expired:', dataObject.id);
        // Clean up abandoned checkouts if needed
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    res.json({ received: true });
    
  } catch (err) {
    console.error(`Error processing webhook:`, err);
    res.status(500).send(`Webhook processing error: ${err.message}`);
  }
});

/**
 * @route   GET /api/payments/verify-session
 * @desc    Verify a checkout session status
 * @access  Public
 */
router.get('/verify-session', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id parameter' });
    }
    
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    res.status(200).json({
      status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total / 100,
      currency: session.currency,
      metadata: session.metadata
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ 
      error: 'Failed to verify session',
      message: isProduction ? 'Verification failed' : error.message
    });
  }
});

/**
 * @route   GET /api/payments/config
 * @desc    Get Stripe configuration for frontend
 * @access  Public
 */
router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    mode: isTestKey ? 'test' : 'live'
  });
});

/**
 * @route   GET /api/payments/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    mode: isTestKey ? 'test' : 'live',
    webhookConfigured: !!webhookSecret,
    environment: process.env.NODE_ENV
  });
});

module.exports = router;