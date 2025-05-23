// File: /src/components/account/OrderHistory/OrderList.jsx

import React from 'react';
import Link from 'next/link';
import OrderStatus from './OrderStatus';
import styles from './OrderHistory.module.css';

const OrderList = ({ orders }) => {
  return (
    <div className={styles.orderListContainer}>
      <div className={styles.orderListHeader}>
        <div className={styles.orderNumber}>Numéro de commande</div>
        <div className={styles.orderDate}>Date</div>
        <div className={styles.orderStatus}>Statut</div>
        <div className={styles.orderTotal}>Total</div>
        <div className={styles.orderActions}>Actions</div>
      </div>

      <div className={styles.orderListBody}>
        {orders.map(order => (
          <div key={order._id} className={styles.orderRow}>
            <div className={styles.orderNumber}>
              {order._id.substring(order._id.length - 8).toUpperCase()}
            </div>
            <div className={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
            </div>
            <div className={styles.orderStatus}>
              <OrderStatus order={order} />
            </div>
            <div className={styles.orderTotal}>
              {order.totalPrice.toFixed(2)} MAD
            </div>
            <div className={styles.orderActions}>
              <Link 
                href={`/account/orders/${order._id}`} 
                className={styles.viewDetailsButton}
              >
                Détails
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;