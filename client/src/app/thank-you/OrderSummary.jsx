import { useState } from 'react';
import styles from './OrderSummary.module.css';

const OrderSummary = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded
  
  // Handle case when order might not be fully loaded or doesn't have all properties
  if (!order) return null;
  
  // Extract order items, handling different possible data structures
  const orderItems = order.orderItems || [];
  
  // Format prices with commas for thousands and always 2 decimal places
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '0,00 MAD';
    return `${price.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MAD`;
  };
  
  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
    return sum + (itemPrice * quantity);
  }, 0);
  
  const shippingCost = typeof order.shippingPrice === 'number' ? order.shippingPrice : 0;
  const total = typeof order.totalPrice === 'number' ? order.totalPrice : subtotal + shippingCost;
  
  // Check if we have any real order items to display
  const hasValidItems = orderItems.length > 0 && orderItems.some(item => item.name);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };
  
  // Payment method human-readable text
  const getPaymentMethod = () => {
    if (!order.paymentMethod) return 'Non spécifié';
    
    switch(order.paymentMethod.toLowerCase()) {
        case 'card':
          return 'Carte bancaire';
        case 'cash':
          return 'Paiement à la livraison';
        case 'transfer':
          return 'Virement bancaire';
        default:
          return order.paymentMethod;
      }
    };
    
    return (
      <div className={styles.orderSummaryContainer}>
        <button 
          className={styles.summaryToggle} 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span>Récapitulatif de la commande</span>
          <svg 
            width="14" 
            height="8" 
            viewBox="0 0 14 8" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={isExpanded ? styles.expanded : ''}
          >
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className={`${styles.summaryContent} ${isExpanded ? styles.visible : ''}`}>
          {hasValidItems ? (
            <div className={styles.orderItems}>
              {orderItems.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        width={60} 
                        height={60} 
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        {item.name?.charAt(0) || 'P'}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.itemDetails}>
                      {item.size && (
                        <span className={styles.itemSize}>Taille: {item.size}</span>
                      )}
                      {item.color && (
                        <span className={styles.itemColor}>Couleur: {item.color}</span>
                      )}
                      <span className={styles.itemQuantity}>Quantité: {item.quantity || 1}</span>
                    </div>
                  </div>
                  
                  <div className={styles.itemPrice}>
                    {formatPrice((item.price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noItems}>Merci de votre achat</p>
          )}
          
          <div className={styles.orderTotals}>
            <div className={styles.totalRow}>
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className={styles.totalRow}>
              <span>Frais de livraison</span>
              <span>{shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost)}</span>
            </div>
            
            <div className={styles.totalRow + ' ' + styles.finalTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          
          {(order.shippingAddress && Object.values(order.shippingAddress).some(v => v)) && (
            <div className={styles.shippingInfo}>
              <h3>Adresse de livraison</h3>
              {order.shippingAddress.fullName && <p>{order.shippingAddress.fullName}</p>}
              {order.shippingAddress.address && <p>{order.shippingAddress.address}</p>}
              {order.shippingAddress.city && (
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}
                </p>
              )}
              {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
              {order.shippingAddress.phoneNumber && <p>Téléphone: {order.shippingAddress.phoneNumber}</p>}
            </div>
          )}
          
          <div className={styles.paymentInfo}>
            <h3>Méthode de paiement</h3>
            <p>{getPaymentMethod()}</p>
            {order.isPaid && order.paidAt && (
              <p className={styles.paidStatus}>
                Payé le {formatDate(order.paidAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
export default OrderSummary;