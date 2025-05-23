// src/components/StripePaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true // Remove postal code field for international use
};

const StripePaymentForm = ({ clientSecret, paymentIntentId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Check payment status if we already have a paymentIntentId
  useEffect(() => {
    if (paymentIntentId && clientSecret) {
      checkPaymentStatus(paymentIntentId);
    }
  }, [paymentIntentId, clientSecret]);

  // Function to check payment status periodically
  const checkPaymentStatus = async (id) => {
    if (!id || checkingStatus) return;
    
    setCheckingStatus(true);
    try {
      const response = await fetch(`http://localhost:5001/api/payment-status/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }
      
      const data = await response.json();
      console.log('Payment status check:', data);
      
      if (data.status === 'succeeded') {
        setPaymentStatus('Payment successful!');
        onSuccess && onSuccess({ id: data.id, status: data.status });
      } else if (data.status === 'requires_payment_method') {
        // Payment needs completion, continue showing form
        setPaymentStatus('Waiting for payment method...');
      } else if (data.status === 'requires_action' || data.status === 'requires_confirmation') {
        setPaymentStatus(`Additional verification required: ${data.status}`);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setCheckingStatus(false);
      
      // Continue checking every 3 seconds if payment isn't completed
      setTimeout(() => {
        if (paymentIntentId) {
          checkPaymentStatus(paymentIntentId);
        }
      }, 3000);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Payment form submitted');

    if (!stripe || !elements) {
      console.error('Stripe not loaded');
      setErrorMessage('Le système de paiement n\'est pas disponible. Veuillez réessayer plus tard.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setPaymentStatus('Processing payment...');

    try {
      console.log('Confirming payment with client secret');
      
      // Get card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'BRENDT Customer', // You could make this dynamic from the form
          }
        }
      });

      console.log('Payment confirmation result:', result);

      if (result.error) {
        // Show error to your customer
        console.error('Payment error:', result.error);
        setErrorMessage(result.error.message);
        setPaymentStatus('Payment failed');
        onError && onError(result.error.message);
      } else {
        console.log('Payment result:', result.paymentIntent);
        
        if (result.paymentIntent.status === 'succeeded') {
          // The payment succeeded!
          console.log('Payment succeeded!');
          setPaymentStatus('Payment succeeded!');
          onSuccess && onSuccess(result.paymentIntent);
        } else if (result.paymentIntent.status === 'requires_action') {
          // The payment requires additional customer action
          setPaymentStatus('Additional verification required...');
          // Start checking for updates
          checkPaymentStatus(result.paymentIntent.id);
        } else {
          // Payment is processing or requires further action
          setPaymentStatus(`Payment status: ${result.paymentIntent.status}`);
          // Start checking for updates
          checkPaymentStatus(result.paymentIntent.id);
        }
      }
    } catch (error) {
      console.error('Exception during payment processing:', error);
      setErrorMessage('Une erreur inattendue s\'est produite lors du traitement du paiement.');
      setPaymentStatus('Payment processing error');
      onError && onError('An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div className="form-row">
        <label htmlFor="card-element">
          Carte de crédit ou de débit
        </label>
        <div style={{ padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', marginBottom: '20px' }}>
          <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      
      {errorMessage && (
        <div className="error-message" style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#fff0f0', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}
      
      {paymentStatus && !errorMessage && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '4px', color: '#0c5460' }}>
          {paymentStatus}
        </div>
      )}
      
      <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
        <p>Pour tester, utilisez la carte 4242 4242 4242 4242, date future, et CVC 123</p>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        style={{
          backgroundColor: '#9D5247',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          width: '100%',
          opacity: (!stripe || isProcessing) ? 0.7 : 1
        }}
      >
        {isProcessing ? 'Traitement en cours...' : 'Payer maintenant'}
      </button>
    </form>
  );
};

export default StripePaymentForm;