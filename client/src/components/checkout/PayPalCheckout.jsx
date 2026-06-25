'use client';

// International checkout — PayPal Smart Buttons (EU/US only; Morocco never renders this).
// Loads the PayPal JS SDK for the active currency, then drives the two-step server flow:
//   1. createOrder  → POST /payments/paypal/create-order  (server creates the PayPal order)
//   2. onApprove    → POST /payments/paypal/capture-order (server captures + persists OUR order)
// The order is only saved in our DB after a successful capture (no orphan unpaid orders).

import { useEffect, useRef, useState } from 'react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://brendt-store-production-d6ef.up.railway.app/api';

export default function PayPalCheckout({
  amount,
  currency,
  region,
  buildOrderData,
  validate,
  onSuccess,
  onError,
}) {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Keep the latest props in refs so the (render-once) button callbacks never go stale.
  const latest = useRef({ amount, currency, region, buildOrderData, validate, onSuccess, onError });
  latest.current = { amount, currency, region, buildOrderData, validate, onSuccess, onError };

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // Load the PayPal SDK for this currency. Reload if the currency changes.
  useEffect(() => {
    if (!clientId) {
      setLoadError('PayPal n\'est pas configuré. Veuillez réessayer plus tard.');
      return;
    }

    const SCRIPT_ID = 'paypal-sdk';
    const existing = document.getElementById(SCRIPT_ID);
    // If a script for a different currency is present, remove it so we can reload
    // (e.g. the visitor switched region on the checkout page).
    if (existing && existing.getAttribute('data-currency') !== currency) {
      existing.remove();
      delete window.paypal;
      setSdkReady(false);
    } else if (window.paypal) {
      setSdkReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=${encodeURIComponent(currency)}&intent=capture`;
    script.setAttribute('data-currency', currency);
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setLoadError('Échec du chargement de PayPal. Vérifiez votre connexion.');
    document.body.appendChild(script);
    // We intentionally leave the script in place between renders (it's reused).
  }, [clientId, currency]);

  // Render the buttons once the SDK is ready.
  useEffect(() => {
    if (!sdkReady || !window.paypal || !containerRef.current) return;

    // Clear any previously rendered instance (e.g. after an SDK reload).
    containerRef.current.innerHTML = '';

    const buttons = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'paypal' },

      createOrder: async () => {
        const { validate: v, amount: amt, currency: cur, region: reg, onError: err } = latest.current;
        // Run the page's form validation first; abort if invalid.
        if (typeof v === 'function') {
          const validationError = v();
          if (validationError) {
            if (typeof err === 'function') err(validationError);
            throw new Error(validationError);
          }
        }
        const resp = await fetch(`${API_BASE}/payments/paypal/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amt, currency: cur, region: reg }),
        });
        const data = await resp.json();
        if (!resp.ok || !data.id) {
          throw new Error(data.error || 'Impossible de créer la commande PayPal');
        }
        return data.id;
      },

      onApprove: async (data) => {
        const { buildOrderData: build, onSuccess: ok, onError: err } = latest.current;
        try {
          const orderData = typeof build === 'function' ? build() : null;
          if (!orderData) throw new Error('Données de commande manquantes');

          const token =
            (typeof window !== 'undefined' &&
              (localStorage.getItem('userToken') || localStorage.getItem('auth-token'))) ||
            null;
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const resp = await fetch(`${API_BASE}/payments/paypal/capture-order`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ paypalOrderId: data.orderID, orderData }),
          });
          const created = await resp.json();
          if (!resp.ok) {
            throw new Error(created.error || 'Échec de la capture du paiement');
          }
          if (typeof ok === 'function') ok(created);
        } catch (e) {
          if (typeof err === 'function') err(e.message || 'Le paiement a échoué.');
        }
      },

      onError: (e) => {
        const { onError: err } = latest.current;
        console.error('PayPal Buttons error:', e);
        if (typeof err === 'function') err('Une erreur est survenue avec PayPal. Veuillez réessayer.');
      },
    });

    buttons.render(containerRef.current).catch((e) => {
      console.error('PayPal render error:', e);
    });

    return () => {
      try {
        buttons.close();
      } catch {
        /* no-op */
      }
    };
  }, [sdkReady, currency]);

  if (loadError) {
    return <div style={{ color: '#dc2626', fontSize: '0.9rem', textAlign: 'center' }}>{loadError}</div>;
  }

  return (
    <div>
      {!sdkReady && (
        <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', padding: '0.5rem' }}>
          Chargement de PayPal…
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}
