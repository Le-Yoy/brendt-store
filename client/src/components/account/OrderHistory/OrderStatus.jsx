// File: /src/components/account/OrderHistory/OrderStatus.jsx

import React from 'react';
import styles from './OrderHistory.module.css';

const OrderStatus = ({ order }) => {
  let statusText = 'En attente';
  let statusClass = styles.pending;

  if (order.isDelivered) {
    statusText = 'Livré';
    statusClass = styles.delivered;
  } else if (order.isPaid) {
    statusText = 'En cours';
    statusClass = styles.processing;
  }

  return (
    <span className={`${styles.statusBadge} ${statusClass}`}>
      {statusText}
    </span>
  );
};

export default OrderStatus;