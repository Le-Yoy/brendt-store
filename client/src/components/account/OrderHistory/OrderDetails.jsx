// File: /src/components/account/OrderHistory/OrderDetails.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OrderStatus from './OrderStatus';
import styles from './OrderHistory.module.css';

const OrderDetails = ({ order }) => {
  if (!order) {
    return <div>Commande non trouvée</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.orderDetailsContainer}>
      <div className={styles.orderInfoSection}>
        <div className={styles.orderInfoCard}>
          <h3>Informations sur la commande</h3>
          <p><strong>Numéro de commande:</strong> {order._id}</p>
          <p><strong>Date de commande:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Statut de la commande:</strong> <OrderStatus order={order} /></p>
          {order.isPaid ? (
            <p><strong>Date de paiement:</strong> {formatDate(order.paidAt)}</p>
          ) : (
            <p><strong>Statut de paiement:</strong> <span className={styles.notPaid}>Non payé</span></p>
          )}
          {order.isDelivered ? (
            <p><strong>Date de livraison:</strong> {formatDate(order.deliveredAt)}</p>
          ) : (
            <p><strong>Statut de livraison:</strong> <span className={styles.notDelivered}>En attente</span></p>
          )}
        </div>

        <div className={styles.orderInfoCard}>
          <h3>Adresse de livraison</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
          <p>{order.shippingAddress.phoneNumber}</p>
        </div>

        <div className={styles.orderInfoCard}>
          <h3>Méthode de paiement</h3>
          <p>{order.paymentMethod}</p>
        </div>
      </div>

      <div className={styles.orderItemsSection}>
        <h3>Articles commandés</h3>
        <div className={styles.orderItemsList}>
          {order.orderItems.map((item, index) => (
            <div key={index} className={styles.orderItem}>
              <div className={styles.itemImage}>
                <Image 
                  src={item.image || '/assets/images/placeholder.jpg'} 
                  alt={item.name} 
                  width={80} 
                  height={80} 
                  objectFit="cover"
                />
              </div>
              <div className={styles.itemDetails}>
                <Link href={`/products/${item.product}`} className={styles.itemName}>
                  {item.name}
                </Link>
                <p className={styles.itemVariant}>
                  {item.size && <span>Taille: {item.size}</span>}
                  {item.color && <span>Couleur: {item.color}</span>}
                </p>
              </div>
              <div className={styles.itemQuantity}>
                x{item.qty}
              </div>
              <div className={styles.itemPrice}>
                {(item.price * item.qty).toFixed(2)} MAD
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.orderSummary}>
        <h3>Récapitulatif</h3>
        <div className={styles.summaryRow}>
          <span>Sous-total:</span>
          <span>{order.itemsPrice.toFixed(2)} MAD</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Livraison:</span>
          <span>{order.shippingPrice.toFixed(2)} MAD</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Taxes:</span>
          <span>{order.taxPrice.toFixed(2)} MAD</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span>Total:</span>
          <span>{order.totalPrice.toFixed(2)} MAD</span>
        </div>
      </div>

      <div className={styles.orderActionsSection}>
        <Link href="/account/orders" className={styles.backButton}>
          Retour aux commandes
        </Link>
        {!order.isDelivered && (
          <button className={styles.trackButton}>
            Suivre ma commande
          </button>
        )}
        <button className={styles.reorderButton}>
          Commander à nouveau
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;