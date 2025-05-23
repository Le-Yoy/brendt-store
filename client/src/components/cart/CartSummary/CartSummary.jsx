// src/components/cart/CartSummary/CartSummary.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import useCart from '../../../hooks/useCart';
import styles from './CartSummary.module.css';

export default function CartSummary() {
  const { items, total, formatPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  
  // Calculate shipping cost (free over 1000 MAD)
  const shippingCost = total >= 1000 ? 0 : 75;
  const grandTotal = total + shippingCost;

  const handlePromoCode = (e) => {
    e.preventDefault();
    // Simple validation for demo
    if (!promoCode.trim()) {
      setPromoError('Veuillez entrer un code promo');
      return;
    }
    
    // In a real app, you would validate the promo code with the backend
    setPromoError('Code promo invalide');
  };

  return (
    <div className={styles.cartSummary}>
      <h2 className={styles.summaryTitle}>Résumé de la commande</h2>
      
      <div className={styles.summaryItems}>
        <div className={styles.summaryRow}>
          <span>Sous-total</span>
          <span>{formatPrice(total)}</span>
        </div>
        
        <div className={styles.summaryRow}>
          <span>Livraison</span>
          <span>
            {shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost)}
          </span>
        </div>
        
        {shippingCost > 0 && (
          <div className={styles.shippingNote}>
            <span>Livraison gratuite à partir de {formatPrice(1000)}</span>
          </div>
        )}
      </div>
      
      <div className={styles.promoSection}>
        <form onSubmit={handlePromoCode} className={styles.promoForm}>
          <input 
            type="text" 
            placeholder="Code promo" 
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className={styles.promoInput}
          />
          <button type="submit" className={styles.promoButton}>Appliquer</button>
        </form>
        {promoError && <p className={styles.promoError}>{promoError}</p>}
      </div>
      
      <div className={styles.totalSection}>
        <div className={styles.grandTotal}>
          <span>Total</span>
          <span className={styles.grandTotalValue}>{formatPrice(grandTotal)}</span>
        </div>
      </div>
      
      <Link href="/checkout" className={styles.checkoutButton}>
        Passer à la caisse
      </Link>
      
      <div className={styles.paymentMethods}>
        <p>Moyens de paiement acceptés</p>
        <div className={styles.paymentIcons}>
          <span className={styles.paymentIcon}>Visa</span>
          <span className={styles.paymentIcon}>MasterCard</span>
          <span className={styles.paymentIcon}>PayPal</span>
        </div>
      </div>
    </div>
  );
}