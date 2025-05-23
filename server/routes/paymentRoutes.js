const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Webhook handlers
const { handleSuccessfulPayment, handleFailedPayment } = require('../webhooks/stripeWebhooks');

// Initialize Stripe with secret key from environment variables
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51OFY8OKD6oC0E24lRsBz15aZ021IledPq9WQ33NCNOf944Bsa3dd7ItTjjYMDnE290mVJiy1BPF3C3LVOhROelBq00ls0x5qIS';
const stripe = require('stripe')(stripeKey);

// Webhook secret from environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret';

// Client URL for redirects
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * @route   POST /api/create-payment-intent
 * @desc    Create a payment intent for Stripe checkout
 * @access  Public
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    console.log('Payment request received:', req.body);
    
    // Extract amount and currency from request body
    const { amount, currency = 'usd', orderId } = req.body;
    
    if (!amount) {
      return res.status(400).json({ 
        error: 'Missing required parameter: amount' 
      });
    }
    
    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    
    console.log(`Creating payment intent: ${amountInCents} cents (${amount} ${currency})`);
    
    // Create the payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      // Add metadata for tracking
      metadata: {
        orderId: orderId || 'checkout-page',
        integration: 'brendt-ecommerce'
      },
      // Enable auto confirmation with common payment methods
      payment_method_types: ['card'],
      // If true, can directly redirect the customer to their bank
      automatic_payment_methods: {
        enabled: true
      },
      // Ensures synchronous confirmation
      confirm: false
    });

    console.log('Payment intent created:', paymentIntent.id);
    
    // Return the client secret to the frontend
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Send detailed error information
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      type: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   POST /api/create-checkout-session
 * @desc    Create a checkout session for Stripe checkout
 * @access  Public
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('Checkout session request received:', req.body);
    
    // Extract parameters from request body
    const { madAmount, items } = req.body;
    
    if (!madAmount) {
      return res.status(400).json({ 
        error: 'Missing required parameter: madAmount' 
      });
    }
    
    // Convert MAD to USD
    const usdAmount = madAmount / 9.5;
    const roundedUsdAmount = Math.round(usdAmount * 100) / 100;
    
    console.log('Payment calculation:', {
      originalMAD: madAmount,
      conversionRate: '1 USD = 9.5 MAD',
      convertedUSD: roundedUsdAmount
    });
    
    // Prepare line items
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'BRENDT Order',
          description: 'Complete order payment',
        },
        unit_amount: Math.round(roundedUsdAmount * 100),
      },
      quantity: 1,
    }];
    
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${clientUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/checkout?canceled=true`,
      metadata: {
        orderId: 'checkout-' + Date.now(),
        integration: 'brendt-ecommerce-checkout',
        madAmount: madAmount
      }
    });
    
    console.log('Checkout session created:', session.id);
    
    // Return the session URL for redirecting the customer
    res.status(200).json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      type: error.type
    });
  }
});

/**
 * @route   POST /api/webhook
 * @desc    Stripe webhook endpoint for event handling
 * @access  Public (but secured by Stripe signature verification)
 */
// IMPORTANT: This route needs raw body, not JSON-parsed body
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the event came from Stripe using the webhook secret
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  try {
    // Get the object from the event
    const dataObject = event.data.object;
    
    console.log(`Received webhook event: ${event.type}`);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handleSuccessfulPayment(dataObject);
        break;
        
      case 'payment_intent.payment_failed':
        await handleFailedPayment(dataObject);
        break;
        
      case 'checkout.session.completed':
        // Handle checkout completion if using Checkout
        console.log('Checkout session completed:', dataObject.id);
        // Update order status in database if needed
        break;
        
      case 'checkout.session.async_payment_succeeded':
        console.log('Async payment succeeded for checkout session:', dataObject.id);
        break;
        
      case 'checkout.session.async_payment_failed':
        console.log('Async payment failed for checkout session:', dataObject.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error(`Error processing webhook event:`, err);
    res.status(500).send(`Webhook processing error: ${err.message}`);
  }
});

/**
 * @route   GET /api/payment-test
 * @desc    Test endpoint to verify payment routes are working
 * @access  Public
 */
router.get('/payment-test', (req, res) => {
  try {
    res.json({ 
      message: 'Payment routes are working!',
      stripeConfigured: Boolean(stripeKey),
      webhookConfigured: Boolean(webhookSecret)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/payment-status/:id
 * @desc    Check status of a payment intent
 * @access  Public
 */
router.get('/payment-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }
    
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    
    res.status(200).json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/verify-session
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
      currency: session.currency
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;