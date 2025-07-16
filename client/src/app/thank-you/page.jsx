"use client";
import { Suspense } from 'react';
import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './ThankYou.module.css';
import OrderSummary from './OrderSummary';
import OrderStatus from './OrderStatus';
import RecommendedProducts from './RecommendedProducts';
import CartContext from '@/contexts/CartContext';
import useCart from '@/hooks/useCart';
import { trackPurchase } from '@/utils/facebookPixel';

function ThankYouPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const canceled = searchParams.get('canceled');
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseTracked, setPurchaseTracked] = useState(false);
  const cartContext = useContext(CartContext);
  const cart = useCart();
  
  // Enhanced Purchase Tracking
  useEffect(() => {
    if (orderDetails && !purchaseTracked && !canceled && orderDetails.totalPrice > 0) {
      const trackPurchaseEvent = () => {
        try {
          console.log('🔥 TRACKING FACEBOOK PURCHASE:', orderDetails);
          
          if (typeof window !== 'undefined' && window.fbq) {
            // Enhanced Purchase event
            window.fbq('track', 'Purchase', {
              value: parseFloat(orderDetails.totalPrice) || 0,
              currency: 'MAD',
              content_ids: (orderDetails.orderItems || []).map(item => 
                item.product || item._id || `item_${Date.now()}`
              ),
              content_type: 'product',
              num_items: (orderDetails.orderItems || []).length,
              content_name: 'BRENDT Shoes Purchase',
              content_category: 'shoes'
            });
            
            // Backup method using existing function
            trackPurchase({
              totalPrice: orderDetails.totalPrice,
              currency: 'MAD',
              items: orderDetails.orderItems || []
            });
            
            // WhatsApp attribution
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('utm_source') === 'whatsapp') {
              window.fbq('trackCustom', 'WhatsAppPurchase', {
                value: parseFloat(orderDetails.totalPrice) || 0,
                currency: 'MAD',
                campaign: 'morocco2025',
                payment_method: orderDetails.paymentMethod || 'unknown'
              });
            }
            
            // Payment method tracking
            window.fbq('trackCustom', 'PaymentMethodUsed', {
              payment_method: orderDetails.paymentMethod || 'unknown',
              value: parseFloat(orderDetails.totalPrice) || 0,
              currency: 'MAD'
            });
            
            setPurchaseTracked(true);
            console.log('🔥 PURCHASE TRACKING COMPLETED');
          }
        } catch (error) {
          console.error('Purchase tracking error:', error);
        }
      };
      
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(trackPurchaseEvent, 1000);
      return () => clearTimeout(timer);
    }
  }, [orderDetails, purchaseTracked, canceled]);
  
  // Clear cart after successful checkout
  useEffect(() => {
    const clearCartAfterCheckout = () => {
      try {
        const shouldClearCart = sessionStorage.getItem('clear-cart-after-redirect');
        
        if (shouldClearCart === 'true' && !canceled) {
          console.log('[THANK-YOU] Clearing cart after successful checkout');
          
          if (cartContext && cartContext.dispatch) {
            cartContext.dispatch({ type: 'CLEAR_CART' });
          }
          
          if (cart && cart.clearCart) {
            cart.clearCart();
          }
          
          sessionStorage.removeItem('clear-cart-after-redirect');
          localStorage.removeItem('brendt-cart');
          sessionStorage.removeItem('brendt-cart');
          
          console.log('[THANK-YOU] Cart cleared successfully');
        }
      } catch (error) {
        console.error('[THANK-YOU] Error clearing cart:', error);
      }
    };
    
    const timer = setTimeout(clearCartAfterCheckout, 500);
    return () => clearTimeout(timer);
  }, [cartContext, cart, canceled]);
  
  // Format delivery date
  const getEstimatedDelivery = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const startDays = currentHour < 15 ? 1 : 2;
    const endDays = startDays + 2;
    
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + startDays);
    
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + endDays);
    
    const options = { day: 'numeric', month: 'long' };
    return {
      start: startDate.toLocaleDateString('fr-FR', options),
      end: endDate.toLocaleDateString('fr-FR', options),
      range: `${startDate.toLocaleDateString('fr-FR', options)} - ${endDate.toLocaleDateString('fr-FR', options)}`
    };
  };
  
  // Load order data
  useEffect(() => {
    const getOrderFromStorage = () => {
      try {
        const thankyouData = sessionStorage.getItem('thank-you-data') || localStorage.getItem('thank-you-data');
        if (thankyouData) {
          const parsedData = JSON.parse(thankyouData);
          console.log('[THANK-YOU] Retrieved thank-you data:', parsedData);
          return parsedData;
        }
      } catch (e) {
        console.warn('[THANK-YOU] Could not retrieve thank-you data:', e);
      }
      
      try {
        const cartData = sessionStorage.getItem('cart') || localStorage.getItem('cart');
        if (cartData) {
          const parsedCart = JSON.parse(cartData);
          
          let shippingAddress = {};
          try {
            const checkoutData = sessionStorage.getItem('checkout-form') || localStorage.getItem('checkout-form');
            if (checkoutData) {
              const parsedForm = JSON.parse(checkoutData);
              shippingAddress = {
                fullName: parsedForm.fullName || '',
                address: parsedForm.address || '',
                city: parsedForm.city || '',
                postalCode: parsedForm.postalCode || '',
                phoneNumber: parsedForm.phone || ''
              };
            }
          } catch (formErr) {
            console.warn('[THANK-YOU] Could not retrieve checkout form data:', formErr);
          }
          
          return {
            _id: 'pending',
            orderNumber: null,
            createdAt: new Date().toISOString(),
            paymentStatus: sessionId ? 'paid' : 'pending',
            paymentMethod: sessionId ? 'card' : 'cash',
            isPaid: !!sessionId,
            paidAt: sessionId ? new Date().toISOString() : null,
            totalPrice: parsedCart.total || 0,
            orderItems: (parsedCart.items || []).map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              image: item.image,
              product: item.productId || item.id
            })),
            shippingAddress
          };
        }
      } catch (e) {
        console.warn('[THANK-YOU] Could not retrieve cart data:', e);
      }
      
      try {
        const recentOrder = sessionStorage.getItem('recent-order') || localStorage.getItem('recent-order');
        if (recentOrder) {
          return JSON.parse(recentOrder);
        }
      } catch (e) {
        console.warn('[THANK-YOU] Could not retrieve recent order:', e);
      }
      
      return null;
    };
    
    if (canceled) {
      setOrderDetails({
        _id: 'canceled',
        orderNumber: null,
        paymentStatus: 'canceled',
        paymentMethod: 'card',
        isPaid: false,
        createdAt: new Date().toISOString(),
        orderItems: [],
        totalPrice: 0
      });
      setLoading(false);
      return;
    }
    
    const processOrder = async () => {
      let orderData = getOrderFromStorage();
      
      if (sessionId) {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://brendt-store-production-d6ef.up.railway.app/api';
          const response = await fetch(`${apiBase}/payments/verify-session?session_id=${sessionId}`);
          
          if (response.ok) {
            const stripeData = await response.json();
            console.log('[THANK-YOU] Stripe session verified:', stripeData);
            
            if (stripeData.metadata?.orderId) {
              try {
                const orderResponse = await fetch(`${apiBase}/orders/${stripeData.metadata.orderId}`);
                if (orderResponse.ok) {
                  const order = await orderResponse.json();
                  console.log('[THANK-YOU] Order fetched from API:', order);
                  orderData = order;
                }
              } catch (error) {
                console.error('[THANK-YOU] Error fetching order:', error);
              }
            }
            
            const order = {
              ...orderData,
              _id: stripeData.metadata?.orderId || (orderData && orderData._id),
              orderNumber: (orderData && orderData.orderNumber) || null,
              paymentStatus: 'paid',
              paymentMethod: 'card',
              isPaid: true,
              paidAt: new Date().toISOString(),
              totalPrice: (stripeData.amount_total || 0) / 100 || (orderData && orderData.totalPrice)
            };
            
            setOrderDetails(order);
            
            try {
              sessionStorage.setItem('recent-order', JSON.stringify(order));
              localStorage.setItem('recent-order', JSON.stringify(order));
            } catch (e) {
              console.warn('[THANK-YOU] Error saving processed order:', e);
            }
          } else {
            console.warn('[THANK-YOU] Session verification failed, using stored data or showing fallback');
            setOrderDetails(orderData || { orderNumber: null, totalPrice: 0 });
          }
        } catch (error) {
          console.error('[THANK-YOU] Error in session verification:', error);
          setOrderDetails(orderData || { orderNumber: null, totalPrice: 0 });
        }
      } else {
        if (orderData) {
          setOrderDetails(orderData);
        } else {
          setOrderDetails({ orderNumber: null, totalPrice: 0 });
        }
      }
      
      setLoading(false);
    };
    
    processOrder();
  }, [sessionId, canceled]);
  
  if (loading) {
    return (
      <div className={styles.thankYouPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Nous finalisons votre commande...</p>
        </div>
      </div>
    );
  }
  
  const deliveryDates = getEstimatedDelivery();
  const orderNumber = orderDetails?.orderNumber || '';
  
  return (
    <div className={styles.thankYouPage}>
      <div className={styles.container}>
        {canceled ? (
          <div className={styles.canceledHeader}>
            <div className={styles.cancelIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h1>Commande annulée</h1>
            <p>Votre session de paiement a été annulée</p>
          </div>
        ) : (
          <div className={styles.thankYouHeader}>
            <div className={styles.checkmark}>
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h1>Merci pour votre commande</h1>
            <p className={styles.confirmation}>Votre commande a été confirmée</p>
          </div>
        )}
        
        <div className={styles.orderInfo}>
          {orderNumber ? (
            <div className={styles.orderNumber}>
              <h2>Numéro de commande</h2>
              <p>{orderNumber}</p>
            </div>
          ) : (
            <div className={styles.orderNumber}>
              <h2>Confirmation de commande</h2>
              <p>Votre commande a été enregistrée</p>
            </div>
          )}
          
          <div className={styles.contactConfirmation}>
            <p>Nous vous contacterons bientôt sur WhatsApp au <span className={styles.phoneHighlight}>{orderDetails?.shippingAddress?.phoneNumber || "numéro fourni"}</span> pour confirmer votre commande</p>
          </div>
        </div>
        
        <OrderStatus order={orderDetails} />
        
        <div className={styles.deliveryInfo}>
          <h2>Livraison estimée</h2>
          <p className={styles.deliveryDate}>{deliveryDates.range}</p>
          <p className={styles.deliveryNote}>Nous vous contacterons lorsque votre commande sera expédiée</p>
        </div>
        
        {orderDetails && <OrderSummary order={orderDetails} />}
        
        <div className={styles.discountSection}>
          <h2>Merci pour votre confiance</h2>
          <div className={styles.discountCard}>
            <div className={styles.discountAmount}>10% de réduction</div>
            <p>Sur votre prochaine commande</p>
            <div className={styles.discountCode}>
              <span>MERCI10</span>
              <button 
                className={styles.copyButton} 
                onClick={() => {
                  navigator.clipboard.writeText('MERCI10')
                    .then(() => alert('Code copié!'))
                    .catch(err => console.error('Erreur de copie:', err));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <RecommendedProducts />
        
        <div className={styles.actions}>
          <Link href="/categories" className={styles.primaryButton}>
            Découvrir d'autres produits
          </Link>
          <Link href="/" className={styles.secondaryButton}>
            Retour à l'accueil
          </Link>
        </div>
        
        <div className={styles.contactSection}>
          <h3>Besoin d'aide?</h3>
          <a 
            href="https://wa.me/33773436514" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.5 0 0 4.5 0 10C0 11.8 0.5 13.5 1.3 15L0 20L5.2 18.7C6.7 19.5 8.3 20 10 20C15.5 20 20 15.5 20 10C20 7.3 19 4.8 17.1 2.9C15.2 1 12.7 0 10 0ZM15.8 14.1C15.6 14.7 14.6 15.4 14 15.4C13.5 15.5 12.8 15.5 12.1 15.3C11.7 15.2 11.1 15 10.4 14.7C7.8 13.7 6.1 11.2 6 11C5.9 10.9 5 9.7 5 8.4C5 7.1 5.6 6.5 5.8 6.2C6 6 6.3 5.9 6.5 5.9C6.6 5.9 6.7 5.9 6.8 5.9C7 5.9 7.1 5.9 7.3 6.4C7.5 6.9 8 8.2 8 8.3C8.1 8.4 8.1 8.5 8 8.7C7.9 8.9 7.9 9 7.8 9.1C7.7 9.2 7.5 9.4 7.4 9.5C7.3 9.6 7.1 9.8 7.3 10.1C7.4 10.4 8 11.3 8.8 12C9.8 12.8 10.5 13.1 10.8 13.2C11 13.3 11.3 13.3 11.4 13.1C11.6 12.9 11.8 12.6 12 12.3C12.2 12.1 12.4 12.1 12.6 12.2C12.8 12.3 14.1 12.9 14.3 13C14.5 13.1 14.7 13.2 14.7 13.3C14.8 13.5 14.8 13.9 14.6 14.5L15.8 14.1Z" fill="#25D366"/>
            </svg>
            <span>Nous contacter sur WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouPageContent />
    </Suspense>
  );
}