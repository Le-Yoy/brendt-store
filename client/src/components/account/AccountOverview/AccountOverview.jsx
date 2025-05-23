// File: /src/components/account/AccountOverview/AccountOverview.jsx

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { orderService } from '@/services';
import styles from './AccountOverview.module.css';

// Cache to prevent repeated requests
const CACHE_DURATION = 60000; // 1 minute
let orderCache = null;
let orderCacheTimestamp = 0;

const AccountOverview = ({ user, orderSummary, loading: parentLoading }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestInProgress = useRef(false);

  // Log props for debugging
  useEffect(() => {
    console.log('[ACCOUNT_OVERVIEW] Props received:', { 
      userExists: !!user, 
      orderSummaryExists: !!orderSummary,
      parentLoading
    });
  }, [user, orderSummary, parentLoading]);

  useEffect(() => {
    // Only fetch if we're not already loading and have a user
    if (!user || requestInProgress.current) {
      return;
    }

    const fetchRecentOrders = async () => {
      try {
        // Set flag to prevent concurrent requests
        requestInProgress.current = true;
        setLoading(true);
        setError(null);
        
        console.log('[ACCOUNT_OVERVIEW] Checking order cache');
        
        // Check cache first
        const now = Date.now();
        if (orderCache && (now - orderCacheTimestamp < CACHE_DURATION)) {
          console.log('[ACCOUNT_OVERVIEW] Using cached orders');
          setRecentOrders(orderCache);
          setLoading(false);
          requestInProgress.current = false;
          return;
        }
        
        console.log('[ACCOUNT_OVERVIEW] Cache expired, fetching recent orders');
        
        // Try to get from localStorage if we have it
        try {
          const cachedOrdersJson = localStorage.getItem('cached-orders');
          if (cachedOrdersJson) {
            const cachedOrders = JSON.parse(cachedOrdersJson);
            if (Array.isArray(cachedOrders) && cachedOrders.length > 0) {
              console.log('[ACCOUNT_OVERVIEW] Using localStorage cached orders');
              
              // Sort and get 3 most recent orders
              const recent = cachedOrders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3);
                
              setRecentOrders(recent);
              setLoading(false);
              
              // Update memory cache
              orderCache = recent;
              orderCacheTimestamp = now;
            }
          }
        } catch (e) {
          console.warn('[ACCOUNT_OVERVIEW] Error reading from localStorage', e);
        }
        
        // Only fetch from API if we don't have cached data
        if (!orderCache) {
          const orders = await orderService.getMyOrders();
          console.log('[ACCOUNT_OVERVIEW] Orders received:', orders?.length || 0);
          
          // Sort and get 3 most recent orders
          if (Array.isArray(orders) && orders.length > 0) {
            const recent = orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3);
              
            setRecentOrders(recent);
            
            // Update both memory and localStorage cache
            orderCache = recent;
            orderCacheTimestamp = now;
            try {
              localStorage.setItem('cached-orders', JSON.stringify(orders));
            } catch (e) {
              console.warn('[ACCOUNT_OVERVIEW] Error saving to localStorage', e);
            }
          } else {
            setRecentOrders([]);
          }
        }
      } catch (err) {
        console.error('[ACCOUNT_OVERVIEW] Error fetching recent orders:', err);
        setError('Impossible de charger les commandes récentes.');
      } finally {
        setLoading(false);
        requestInProgress.current = false;
      }
    };

    fetchRecentOrders();
    
    // Only run this effect once on mount, not on every user change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If parent component is still loading, show loading state
  if (parentLoading || loading) {
    return (
      <div className={styles.loading || 'loading-container'}>
        <div className={styles.loadingSpinner || 'loading-spinner'}></div>
        <p>Chargement de votre tableau de bord...</p>
      </div>
    );
  }

  // If no user data available
  if (!user) {
    return (
      <div className={styles.error || 'error-container'}>
        <p>Impossible de charger vos informations. Veuillez vous reconnecter.</p>
        <Link href="/login" className={styles.loginLink || 'login-link'}>
          Se connecter
        </Link>
      </div>
    );
  }

  // Helper function to get default shipping address
  const getDefaultAddress = () => {
    if (!user.shippingAddresses || !Array.isArray(user.shippingAddresses)) {
      return null;
    }
    return user.shippingAddresses.find(addr => addr.isDefault || addr.isDefaultShipping);
  };
  
  const defaultAddress = getDefaultAddress();

  // Helper function to determine order status style
  const getOrderStatusStyle = (order) => {
    if (!order) return styles.pending || 'status-pending';
    if (order.isDelivered) return styles.delivered || 'status-delivered';
    if (order.isPaid) return styles.processing || 'status-processing';
    return styles.pending || 'status-pending';
  };

  // Helper function to determine order status text
  const getOrderStatusText = (order) => {
    if (!order) return 'En attente';
    if (order.isDelivered) return 'Livré';
    if (order.isPaid) return 'En cours';
    return 'En attente';
  };

  // Get order stats with fallbacks
  const totalOrders = orderSummary?.totalOrders || 0;
  const loyaltyPoints = 0; // Not implemented yet
  const availableCoupons = []; // Not implemented yet

  return (
    <div className={styles.accountOverview || 'account-overview'}>
      {/* Stats Summary Section */}
      <div className={styles.statsSummary || 'stats-summary'}>
        <div className={styles.statCard || 'stat-card'}>
          <h3>Commandes</h3>
          <div className={styles.statValue || 'stat-value'}>{totalOrders}</div>
          <Link href="/account/orders" className={styles.statLink || 'stat-link'}>
            Voir toutes les commandes
          </Link>
        </div>
        
        <div className={styles.statCard || 'stat-card'}>
          <h3>Points Fidélité</h3>
          <div className={styles.statValue || 'stat-value'}>{loyaltyPoints}</div>
          <span className={styles.comingSoon || 'coming-soon'}>Bientôt disponible</span>
        </div>

        <div className={styles.statCard || 'stat-card'}>
          <h3>Coupons</h3>
          <div className={styles.statValue || 'stat-value'}>{availableCoupons.length}</div>
          <span className={styles.comingSoon || 'coming-soon'}>Bientôt disponible</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className={styles.recentOrdersSection || 'recent-orders-section'}>
        <div className={styles.sectionHeader || 'section-header'}>
          <h2>Commandes Récentes</h2>
          <Link href="/account/orders" className={styles.viewAllLink || 'view-all-link'}>
            Voir Tout
          </Link>
        </div>

        {Array.isArray(recentOrders) && recentOrders.length > 0 ? (
          <div className={styles.ordersList || 'orders-list'}>
            {recentOrders.map(order => (
              <div key={order._id} className={styles.orderItem || 'order-item'}>
                <div className={styles.orderMeta || 'order-meta'}>
                  <span className={styles.orderNumber || 'order-number'}>
                    N° {order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  <span className={styles.orderDate || 'order-date'}>
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                <div className={styles.orderStatus || 'order-status'}>
                  <span 
                    className={`${styles.statusBadge || 'status-badge'} ${getOrderStatusStyle(order)}`}
                  >
                    {getOrderStatusText(order)}
                  </span>
                </div>
                
                <div className={styles.orderTotal || 'order-total'}>
                  {(order.totalPrice || 0).toFixed(2)} MAD
                </div>
                
                <div className={styles.orderActions || 'order-actions'}>
                  <Link href={`/account/orders/${order._id}`} className={styles.viewBtn || 'view-btn'}>
                    Détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState || 'empty-state'}>
            <p>Vous n'avez pas encore passé de commande.</p>
            <Link href="/products" className={styles.shopNowBtn || 'shop-now-btn'}>
              Commencer à magasiner
            </Link>
          </div>
        )}
      </div>

      {/* Account Info Section */}
      <div className={styles.accountInfoSection || 'account-info-section'}>
        <div className={styles.sectionHeader || 'section-header'}>
          <h2>Mes Informations</h2>
          <Link href="/account/profile" className={styles.editBtn || 'edit-btn'}>
            Modifier
          </Link>
        </div>
        
        <div className={styles.infoGrid || 'info-grid'}>
          <div className={styles.infoCard || 'info-card'}>
            <h3>Coordonnées</h3>
            <p><strong>Nom:</strong> {user.name || 'Non renseigné'}</p>
            <p><strong>Email:</strong> {user.email || 'Non renseigné'}</p>
            <p><strong>Téléphone:</strong> {user.phone || 'Non renseigné'}</p>
          </div>
          
          <div className={styles.infoCard || 'info-card'}>
            <h3>Adresse de Livraison</h3>
            {defaultAddress ? (
              <>
                <p>{defaultAddress.fullName || user.name}</p>
                <p>{defaultAddress.address || 'Non renseigné'}</p>
                <p>{defaultAddress.city || 'Non renseigné'}{defaultAddress.postalCode ? `, ${defaultAddress.postalCode}` : ''}</p>
                <p>{defaultAddress.phoneNumber || user.phone || 'Non renseigné'}</p>
              </>
            ) : (
              <p>Aucune adresse enregistrée</p>
            )}
            <Link href="/account/addresses" className={styles.manageLink || 'manage-link'}>
              Gérer mes adresses
            </Link>
          </div>
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <div className={styles.errorMessage || 'error-message'}>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton || 'retry-button'}
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountOverview;