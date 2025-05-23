// src/app/account/orders/[orderId]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth'; // Consistent import
import orderService from '@/services/orderService';
import OrderDetails from '@/components/account/OrderHistory/OrderDetails';
import AccountNavigation from '@/components/account/AccountNavigation/AccountNavigation';
import styles from './orderDetail.module.css';

export default function OrderDetailPage({ params }) {
  // Properly handle params in Next.js 15+
  const orderId = params?.orderId;
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Fetch order data when component mounts
  useEffect(() => {
    if (isAuthenticated && orderId) {
      const fetchOrderDetails = async () => {
        try {
          setIsLoading(true);
          const orderData = await orderService.getOrderById(orderId);
          setOrder(orderData);
          setError(null);
        } catch (err) {
          console.error('[ORDER] Error fetching order details:', err);
          setError('Impossible de charger les détails de la commande. Veuillez réessayer.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [isAuthenticated, orderId]);

  // Show loading state while checking authentication or fetching order
  if (loading || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement des détails de la commande...</p>
      </div>
    );
  }

  // If no user (and still on this page), show nothing while redirecting
  if (!user) {
    return null;
  }

  const orderTitle = order ? `Commande #${orderId.substring(orderId.length - 8).toUpperCase()}` : 'Détails de la commande';

  return (
    <div className={styles.orderDetailContainer}>
      <AccountNavigation 
        currentPage="orderDetails"
        previousPage="/account/orders"
        title={orderTitle}
        subtitle={order ? `Passée le ${orderService.formatOrderDate(order.createdAt)}` : ''}
      />

      {error ? (
        <div className={styles.errorContainer}>
          <h2>Erreur</h2>
          <p>{error}</p>
          <div className={styles.actionButtons}>
            <Link href="/account/orders" className={styles.button}>
              Retour aux commandes
            </Link>
            <button onClick={() => window.location.reload()} className={styles.button}>
              Réessayer
            </button>
          </div>
        </div>
      ) : order ? (
        <>
          <OrderDetails order={order} />
          
          <div className={styles.orderActions}>
            <Link href="/account/orders" className={styles.button}>
              Retour à mes commandes
            </Link>
            {!order.isDelivered && (
              <button className={`${styles.button} ${styles.primaryButton}`}>
                Suivre ma commande
              </button>
            )}
            <button className={`${styles.button} ${styles.accentButton}`}>
              Commander à nouveau
            </button>
          </div>
        </>
      ) : (
        <div className={styles.notFoundContainer}>
          <h2>Commande non trouvée</h2>
          <p>Cette commande n'existe pas ou n'est pas associée à votre compte.</p>
          <Link href="/account/orders" className={styles.button}>
            Retour à mes commandes
          </Link>
        </div>
      )}
    </div>
  );
}