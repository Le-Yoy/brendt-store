// server/webhooks/stripeWebhooks.js
const dotenv = require('dotenv');
dotenv.config();

// Database models (import your actual models)
// const Order = require('../models/Order');

/**
 * Handle successful payment completion
 * @param {Object} paymentIntent - The payment intent object from Stripe
 */
const handleSuccessfulPayment = async (paymentIntent) => {
  try {
    console.log('Payment succeeded:', paymentIntent.id);
    
    // 1. Find the order using the payment intent ID stored in metadata
    // const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    
    // 2. Update order status to paid
    // if (order) {
    //   order.status = 'paid';
    //   order.paymentStatus = 'completed';
    //   order.paidAt = new Date();
    //   await order.save();
    //   console.log(`Order ${order._id} marked as paid`);
    // } else {
    //   console.warn(`No order found for payment intent: ${paymentIntent.id}`);
    // }
    
    // For now, just log the success
    console.log('Would update order for payment intent:', paymentIntent.id);
    console.log('Amount paid:', paymentIntent.amount / 100, paymentIntent.currency);
    console.log('Customer:', paymentIntent.customer);
    console.log('Metadata:', paymentIntent.metadata);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

/**
 * Handle payment failure
 * @param {Object} paymentIntent - The payment intent object from Stripe
 */
const handleFailedPayment = async (paymentIntent) => {
  try {
    console.log('Payment failed:', paymentIntent.id);
    
    // 1. Find the order using the payment intent ID
    // const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    
    // 2. Update order status to payment_failed
    // if (order) {
    //   order.paymentStatus = 'failed';
    //   order.paymentError = paymentIntent.last_payment_error?.message || 'Unknown error';
    //   await order.save();
    //   console.log(`Order ${order._id} marked as payment failed`);
    // } else {
    //   console.warn(`No order found for failed payment intent: ${paymentIntent.id}`);
    // }
    
    // For now, just log the failure
    console.log('Would update order as failed for payment intent:', paymentIntent.id);
    console.log('Failure reason:', paymentIntent.last_payment_error?.message);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

module.exports = {
  handleSuccessfulPayment,
  handleFailedPayment
};