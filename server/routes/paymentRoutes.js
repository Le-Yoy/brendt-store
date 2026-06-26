const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Import Order model for webhook processing
const Order = require('../models/Order');
const { optionalAuth } = require('../middleware/authMiddleware');
const { sendPurchaseEvent } = require('../utils/facebookConversionsAPI');

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

// =====================================================================
// PayPal — international checkout (EU / US only). Morocco never sees this.
// REST Orders v2. Base URL + credentials chosen by PAYPAL_ENV (sandbox|live).
// =====================================================================
const PAYPAL_ENV = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
const PAYPAL_BASE = PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Region → the only currency PayPal may transact in for that region. MA is absent on purpose.
const PAYPAL_REGION_CURRENCY = { EU: 'EUR', US: 'USD', OTHER: 'USD' };

console.log('PayPal Payment Routes Initialized:', {
  env: PAYPAL_ENV,
  base: PAYPAL_BASE,
  configured: !!(PAYPAL_CLIENT_ID && PAYPAL_SECRET)
});

// Get an OAuth2 access token from PayPal (client_credentials).
async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('PayPal credentials not configured');
  }
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const resp = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`PayPal OAuth failed: ${resp.status} ${t}`);
  }
  const data = await resp.json();
  return data.access_token;
}

// TEMPORARY DIAGNOSTIC — remove after verifying PayPal config. No secrets exposed.
router.get('/paypal/diag', async (req, res) => {
  const out = {
    node: process.version,
    hasFetch: typeof fetch !== 'undefined',
    env: PAYPAL_ENV,
    base: PAYPAL_BASE,
    clientIdSet: !!PAYPAL_CLIENT_ID,
    secretSet: !!PAYPAL_SECRET,
    clientIdPrefix: PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.slice(0, 4) : null,
  };
  try {
    const token = await getPayPalAccessToken();
    out.oauth = 'ok';
    out.tokenLen = token ? token.length : 0;
  } catch (e) {
    out.oauth = 'failed';
    out.oauthError = e.message;
  }
  res.json(out);
});

/**
 * @route   POST /api/payments/paypal/create-order
 * @desc    Create a PayPal order (returns the PayPal order id for the JS SDK buttons)
 * @access  Public (international regions only — gated by region)
 */
router.post('/paypal/create-order', paymentLimiter, async (req, res) => {
  try {
    const { amount, currency, region } = req.body;

    // Region gate: PayPal is international-only. Morocco must never reach here.
    if (!region || region === 'MA') {
      return res.status(400).json({ error: 'PayPal is not available for this region' });
    }
    const expectedCurrency = PAYPAL_REGION_CURRENCY[region];
    if (!expectedCurrency) {
      return res.status(400).json({ error: 'Unsupported region for PayPal' });
    }
    if (currency && currency !== expectedCurrency) {
      return res.status(400).json({ error: `Currency ${currency} does not match region ${region}` });
    }

    const value = Number(amount);
    if (!value || value <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }
    const MAX_AMOUNT = 10000; // generous ceiling per order
    if (value > MAX_AMOUNT) {
      return res.status(400).json({ error: 'Amount exceeds maximum allowed' });
    }

    const accessToken = await getPayPalAccessToken();
    const resp = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: expectedCurrency, value: value.toFixed(2) },
          description: 'BRENDT Order'
        }]
      })
    });
    const data = await resp.json();
    if (!resp.ok || !data.id) {
      console.error('PayPal create-order failed:', JSON.stringify(data));
      return res.status(502).json({ error: 'Failed to create PayPal order' });
    }

    console.log('PayPal order created:', { id: data.id, region, currency: expectedCurrency, value });
    res.status(200).json({ id: data.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({
      error: 'Failed to create PayPal order',
      message: isProduction ? 'Payment processing error' : error.message
    });
  }
});

/**
 * @route   POST /api/payments/paypal/capture-order
 * @desc    Capture an approved PayPal order, then create OUR paid order (isPaid:true).
 *          Order is only persisted after a successful capture (no orphan unpaid orders).
 * @access  Public (optionalAuth links the order to a logged-in user)
 */
router.post('/paypal/capture-order', paymentLimiter, optionalAuth, async (req, res) => {
  try {
    const { paypalOrderId, orderData } = req.body;
    if (!paypalOrderId || !orderData || !orderData.orderItems) {
      return res.status(400).json({ error: 'Missing paypalOrderId or orderData' });
    }

    // Re-assert the region gate server-side (never trust the client).
    const region = orderData.region;
    if (!region || region === 'MA') {
      return res.status(400).json({ error: 'PayPal is not available for this region' });
    }
    const expectedCurrency = PAYPAL_REGION_CURRENCY[region];
    if (!expectedCurrency) {
      return res.status(400).json({ error: 'Unsupported region for PayPal' });
    }
    if (orderData.currency && orderData.currency !== expectedCurrency) {
      return res.status(400).json({ error: 'Currency/region mismatch' });
    }

    // Capture the payment.
    const accessToken = await getPayPalAccessToken();
    const capResp = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    const capture = await capResp.json();
    if (!capResp.ok || capture.status !== 'COMPLETED') {
      console.error('PayPal capture failed:', JSON.stringify(capture));
      return res.status(502).json({ error: 'Payment capture failed', status: capture.status });
    }

    const captureUnit = capture.purchase_units?.[0]?.payments?.captures?.[0];
    const payer = capture.payer || {};

    // Build and save our order, paid via PayPal.
    const order = new Order({
      orderItems: orderData.orderItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: 'paypal',
      itemsPrice: Number(orderData.itemsPrice) || 0,
      shippingPrice: Number(orderData.shippingPrice) || 0,
      totalPrice: Number(orderData.totalPrice) || 0,
      currency: expectedCurrency,
      region,
      isPaid: true,
      paidAt: Date.now(),
      // Link to the user if authenticated; otherwise it's a guest order.
      ...(req.user ? { user: req.user._id } : { isGuestOrder: true }),
      paymentResult: {
        id: captureUnit?.id || capture.id,
        status: capture.status,
        update_time: captureUnit?.update_time || new Date().toISOString(),
        email_address: payer?.email_address || ''
      }
    });

    const validationError = order.validateSync();
    if (validationError) {
      console.error('PayPal order validation error:', JSON.stringify(validationError.errors));
      return res.status(400).json({ error: Object.values(validationError.errors)[0].message });
    }

    const createdOrder = await order.save();
    console.log('PayPal order created + paid:', {
      id: createdOrder._id,
      orderNumber: createdOrder.orderNumber,
      currency: expectedCurrency
    });

    // Facebook Conversions API — parity with the COD/card createOrder path.
    try {
      await sendPurchaseEvent({
        email: payer?.email_address || createdOrder.shippingAddress?.email || 'unknown@brendt.com',
        phone: createdOrder.shippingAddress?.phoneNumber || '',
        firstName: payer?.name?.given_name || createdOrder.shippingAddress?.fullName || 'Customer',
        lastName: payer?.name?.surname || '',
        totalAmount: createdOrder.totalPrice || 0,
        orderId: createdOrder.orderNumber || createdOrder._id.toString(),
        currency: expectedCurrency
      });
    } catch (fbError) {
      console.error('⚠️ Facebook Conversions API failed (PayPal order still created):', fbError.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({
      error: 'Failed to capture PayPal payment',
      message: isProduction ? 'Payment processing error' : error.message
    });
  }
});

module.exports = router;