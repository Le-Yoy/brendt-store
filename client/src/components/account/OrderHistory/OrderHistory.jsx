import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronDown, FiChevronUp, FiCopy, FiRefreshCw, FiDownload, FiShare2 } from 'react-icons/fi';
import styles from './OrderHistory.module.css';

const OrderList = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    // Optional: Show a toast notification
  };
  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const getStatusColor = (order) => {
    if (order.isCanceled) return styles.statusCanceled;
    if (order.isDelivered) return styles.statusDelivered;
    if (order.isShipped) return styles.statusShipped;
    if (order.isPaid) return styles.statusProcessing;
    return styles.statusPending;
  };
  
  const getStatusLabel = (order) => {
    if (order.isCanceled) return 'Annulée';
    if (order.isDelivered) return 'Livrée';
    if (order.isShipped) return 'Expédiée';
    if (order.isPaid) return 'En préparation';
    return 'En attente';
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  return (
    <div className={styles.orderList}>
      {orders.map(order => (
        <div key={order._id} className={styles.orderCard}>
          <div className={styles.orderHeader} onClick={() => toggleOrderExpand(order._id)}>
            <div className={styles.orderInfo}>
              <div className={styles.orderNumber}>
                <span>Commande #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                <button 
                  className={styles.copyButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyOrderId(order._id);
                  }}
                  title="Copier le numéro de commande"
                >
                  <FiCopy size={14} />
                </button>
              </div>
              <div className={styles.orderDate}>
                {formatDate(order.createdAt)}
              </div>
            </div>
            
            <div className={styles.orderStatus}>
              <span className={`${styles.statusBadge} ${getStatusColor(order)}`}>
                {getStatusLabel(order)}
              </span>
            </div>
            
            <div className={styles.orderTotal}>
              {formatPrice(order.totalPrice)}
            </div>
            
            <button className={styles.expandButton}>
              {expandedOrder === order._id ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          
          {expandedOrder === order._id && (
            <div className={styles.orderDetails}>
              <div className={styles.orderProgress}>
                <div className={styles.progressTrack}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: order.isDelivered ? '100%' : 
                             order.isShipped ? '75%' : 
                             order.isPaid ? '50%' : '25%' 
                    }}
                  ></div>
                </div>
                <div className={styles.progressSteps}>
                  <div className={`${styles.progressStep} ${styles.active}`}>
                    <div className={styles.stepDot}></div>
                    <span>Commande passée</span>
                  </div>
                  <div className={`${styles.progressStep} ${order.isPaid ? styles.active : ''}`}><div className={styles.stepDot}></div>
                    <span>En préparation</span>
                  </div>
                  <div className={`${styles.progressStep} ${order.isShipped ? styles.active : ''}`}>
                    <div className={styles.stepDot}></div>
                    <span>Expédiée</span>
                  </div>
                  <div className={`${styles.progressStep} ${order.isDelivered ? styles.active : ''}`}>
                    <div className={styles.stepDot}></div>
                    <span>Livrée</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.orderProducts}>
                <h3>Articles</h3>
                <div className={styles.productList}>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className={styles.productItem}>
                      <div className={styles.productImage}>
                        <Image 
                          src={item.image || '/assets/images/placeholder.jpg'}
                          alt={item.name}
                          width={80}
                          height={80}
                          objectFit="cover"
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <h4>{item.name}</h4>
                        <div className={styles.productMeta}>
                          {item.size && <span>Taille: {item.size}</span>}
                          {item.color && <span>Couleur: {item.color}</span>}
                          <span>Quantité: {item.qty}</span>
                        </div>
                      </div>
                      <div className={styles.productPrice}>
                        {formatPrice(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span>Sous-total:</span>
                  <span>{formatPrice(order.itemsPrice)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Livraison:</span>
                  <span>{formatPrice(order.shippingPrice)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Taxes:</span>
                  <span>{formatPrice(order.taxPrice)}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total:</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
              
              <div className={styles.orderActions}>
                <Link href={`/account/orders/${order._id}`} className={styles.detailButton}>
                  Voir les détails
                </Link>
                
                <button className={styles.actionButton}>
                  <FiRefreshCw size={14} />
                  <span>Acheter à nouveau</span>
                </button>
                
                <button className={styles.actionButton}>
                  <FiDownload size={14} />
                  <span>Télécharger la facture</span>
                </button>
                
                <button className={styles.actionButton}>
                  <FiShare2 size={14} />
                  <span>Partager mon style</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderList;