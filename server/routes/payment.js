const express = require('express');
const stripe = require('stripe')('sk_test_51OFY8OKD6oC0E24lRsBz15aZ021IledPq9WQ33NCNOf944Bsa3dd7ItTjjYMDnE290mVJiy1BPF3C3LVOhROelBq00ls0x5qIS');
const router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: currency || 'usd',
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;