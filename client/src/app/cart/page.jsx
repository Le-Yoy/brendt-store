// src/app/cart/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientLayout from '@/components/layout/ClientLayout';
import useCart from '@/hooks/useCart';
import styles from './Cart.module.css';

export default function CartPage() {
  return (
    <ClientLayout>
      <CartPageContent />
    </ClientLayout>
  );
}

function CartPageContent() {
  const cart = useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    items, 
    total, 
    itemCount, 
    isCartReady,
    initialized, // Add this
    removeItem, 
    updateQuantity, 
    clearCart, 
    formatPrice,
    createCartBackup 
  } = cart;
  
  const shippingCost = 0;
  const finalTotal = total + shippingCost;

  // Set loading state based on cart readiness
  useEffect(() => {
    if (isCartReady || initialized) {
      // Small delay to ensure all data is loaded
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isCartReady, initialized]);

  // Calculate delivery date
  useEffect(() => {
    const calculateDeliveryDate = () => {
      const now = new Date();
      const isPastFourPM = now.getHours() >= 16; // 4PM = 16:00
      
      // Add 1 or 2 days based on time
      const deliveryDateObj = new Date(now);
      deliveryDateObj.setDate(now.getDate() + (isPastFourPM ? 2 : 1));
      
      // French day and month names for proper formatting
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      
      const dayName = dayNames[deliveryDateObj.getDay()];
      const date = deliveryDateObj.getDate();
      const month = monthNames[deliveryDateObj.getMonth()];
      
      return `${dayName} ${date} ${month}`;
    };
    
    setDeliveryDate(calculateDeliveryDate());
  }, []);

  // Handle quantity updates
  const handleUpdateQuantity = (productId, size, color, newQuantity) => {
    // Create backup before updating (optional)
    if (typeof createCartBackup === 'function') {
      createCartBackup();
    }
    
    updateQuantity(productId, size, color, newQuantity);
  };

  // Handle item removal
  const handleRemoveItem = (productId, size, color) => {
    // Log to debug
    console.log('Removing item:', { productId, size, color });
    
    // Create backup before removing
    if (typeof createCartBackup === 'function') {
      createCartBackup();
    }
    
    removeItem(productId, size, color);
  };

  // Handle cart clearing
  const handleClearCart = () => {
    // Create backup before clearing (optional)
    if (typeof createCartBackup === 'function') {
      createCartBackup();
    }
    
    clearCart();
    setConfirmClear(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement de votre panier...</p>
      </div>
    );
  }

  // Empty cart state
  if (!items || !Array.isArray(items) || items.length === 0 || itemCount === 0) {
    return (
      <div className={styles.emptyCartContainer}>
        <div className={styles.emptyCartContent}>
          <h1 className={styles.pageTitle}>Panier</h1>
          <div className={styles.emptyCartIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
          </div>
          <p className={styles.emptyCartMessage}>Votre panier est vide</p>
          <p className={styles.emptyCartSubtext}>Découvrez notre collection et ajoutez des produits à votre panier.</p>
          <Link href="/categories" className={styles.continueShopping}>
            DÉCOUVRIR LA COLLECTION
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPageContainer}>
      {/* Mobile sticky checkout button */}
      <div className={styles.stickyCheckoutContainer}>
        <Link href="/checkout" className={styles.stickyCheckoutButton}>
          COMMANDER MAINTENANT
        </Link>
      </div>
      
      <h1 className={styles.pageTitle}>VOTRE PANIER</h1>
      
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          <div className={styles.cartHeader}>
            <span className={styles.cartCount}>
              {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
            </span>
            <button 
              className={styles.clearCartButton} 
              onClick={() => setConfirmClear(true)}
            >
              Vider le panier
            </button>
          </div>
          
          <div>
            {items.map((item, index) => (
              <div 
                key={`${item.productId}-${item.color}-${item.size}-${index}`}
                className={`${styles.cartItem} ${styles.fadeIn}`}
              >
                <div className={styles.itemImage}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      width={120} 
                      height={160} 
                      className={styles.productImage}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <div className={styles.itemAttributes}>
                    <div className={styles.attributeItem}>
                      <span className={styles.attributeLabel}>Couleur:</span>
                      <span 
                        className={styles.itemColor} 
                        style={{backgroundColor: item.colorCode}}
                      ></span>
                    </div>
                    <div className={styles.attributeItem}>
                      <span className={styles.attributeLabel}>Taille:</span>
                      <span className={styles.itemSize}>{item.size}</span>
                    </div>
                  </div>
                  
                  <div className={styles.itemControls}>
                    <div className={styles.quantityWrapper}>
                      <span className={styles.quantityLabel}>Quantité:</span>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => handleUpdateQuantity(
                            item.productId, 
                            item.size, 
                            item.color, 
                            Math.max(1, item.quantity - 1)
                          )}
                          disabled={item.quantity <= 1}
                          className={styles.quantityButton}
                          aria-label="Réduire la quantité"
                          type="button"
                        >
                          <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1H11" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
                          </svg>
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(
                            item.productId, 
                            item.size, 
                            item.color, 
                            item.quantity + 1
                          )}
                          className={styles.quantityButton}
                          aria-label="Augmenter la quantité"
                          type="button"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                      type="button"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                
                <div className={styles.itemTotal}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.deliveryInfoContainer}>
            <p className={styles.deliveryDate}>Livraison à partir du {deliveryDate}</p>
            <p className={styles.stockInfo}>Derniers produits disponibles</p>
          </div>
          
          <div className={styles.cartActions}>
            <Link href="/categories" className={styles.continueShoppingBtn}>
              CONTINUER VOS ACHATS
            </Link>
          </div>
        </div>
        
        <div className={styles.cartSummary}>
          <h2 className={styles.summaryTitle}>RÉSUMÉ DE LA COMMANDE</h2>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Sous-total</span>
              <span className={styles.summaryValue}>{formatPrice(total)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Livraison</span>
              <span className={styles.summaryValue}>0 MAD</span>
            </div>
            <div className={styles.shippingNote}>
              Livraison gratuite dans tout le Maroc aujourd'hui.
            </div>
            <div className={styles.summaryTotal}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>{formatPrice(finalTotal)}</span>
            </div>
            <Link href="/checkout" className={styles.checkoutButton}>
              COMMANDER MAINTENANT
            </Link>
            <div className={styles.infoBoxesContainer}>
              <div className={styles.infoBox}>
                <div className={styles.infoBoxContent}>
                  <h3 className={styles.infoBoxTitle}>Retours et échanges</h3>
                  <p className={styles.infoBoxText}>
                    Retours gratuits sous 30 jours à partir de la date de réception des produits (sauf produits personnalisés et masques).
                  </p>
                </div>
                <div className={styles.infoBoxIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7143" stroke="#9D5247" strokeWidth="0.75" strokeLinecap="round"/>
                    <path d="M16 10H8" stroke="#9D5247" strokeWidth="0.75" strokeLinecap="round"/>
                    <path d="M13 7H8" stroke="#9D5247" strokeWidth="0.75" strokeLinecap="round"/>
                    <path d="M15 13H8" stroke="#9D5247" strokeWidth="0.75" strokeLinecap="round"/>
                    <path d="M9 19.5C9 18.1193 10.1193 17 11.5 17H20.5C21.8807 17 23 18.1193 23 19.5C23 20.8807 21.8807 22 20.5 22H11.5C10.1193 22 9 20.8807 9 19.5Z" stroke="#9D5247" strokeWidth="0.75"/>
                    <path d="M17.5 19.5H17.501" stroke="#9D5247" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M14.5 19.5H14.501" stroke="#9D5247" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoBoxContent}>
                  <h3 className={styles.infoBoxTitle}>Livraison</h3>
                  <p className={styles.infoBoxText}>
                    Expédition gratuite. En Europe nous utilisons le service DHL Express et les délais de livraison sont de 3 à 5 jours ouvrables.
                  </p>
                </div>
                <div className={styles.infoBoxIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 16V7H3V16H16Z" stroke="#9D5247" strokeWidth="0.75" strokeLinejoin="round"/>
                    <path d="M16 9H20L22 12V16H16V9Z" stroke="#9D5247" strokeWidth="0.75" strokeLinejoin="round"/>
                    <circle cx="6" cy="19" r="2" stroke="#9D5247" strokeWidth="0.75"/>
                    <circle cx="19" cy="19" r="2" stroke="#9D5247" strokeWidth="0.75"/>
                    <path d="M8 19H17" stroke="#9D5247" strokeWidth="0.75"/>
                    <path d="M10 7V3H3V7" stroke="#9D5247" strokeWidth="0.75" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoBoxContent}>
                  <h3 className={styles.infoBoxTitle}>Paiement et sécurité</h3>
                  <p className={styles.infoBoxText}>
                    Amex, Mastercard, Visa, Paypal, Alipay, Apple Pay, Google Pay, Gift Card
                  </p>
                </div>
                <div className={styles.infoBoxIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="13" rx="2" stroke="#9D5247" strokeWidth="0.75"/>
                    <path d="M3 10H21" stroke="#9D5247" strokeWidth="0.75"/>
                    <path d="M7 15H11" stroke="#9D5247" strokeWidth="0.75" strokeLinecap="round"/>
                    <path d="M15 15H17" stroke="#9D5247" strokeWidth="0.75" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear cart confirmation modal */}
      {confirmClear && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>VIDER LE PANIER</h3>
            <p className={styles.modalText}>Êtes-vous sûr de vouloir vider votre panier ?</p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setConfirmClear(false)}
                type="button"
              >
                Annuler
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleClearCart}
                type="button"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}