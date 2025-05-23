// src/app/account/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useAuth from '@/hooks/useAuth';
import orderService from '@/services/orderService';
import AccountOverview from '@/components/account/AccountOverview/AccountOverview';
import styles from './account.module.css';

// Dashboard load throttling
let lastDashboardLoad = 0;
const DASHBOARD_COOLDOWN = 5000; // 5 seconds between loads

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[DASHBOARD] Component error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h2>Impossible de charger les données</h2>
          <p>Une erreur est survenue lors du chargement de vos informations.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className={styles.retryButton}
          >
            Réessayer
          </button>
          <details className={styles.errorDetails}>
            <summary>Détails techniques</summary>
            <pre>{this.state.error?.message || 'Unknown error'}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AccountPage() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <AccountContent />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}

// Separate component to use the hook inside ProtectedRoute
function AccountContent() {
  const { user, refreshUserData } = useAuth();
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestInProgress = useRef(false);

  // Debug authentication state
  useEffect(() => {
    console.log('[ACCOUNT] Debug auth state:', { 
      isAuthenticated: !!user, 
      userExists: !!user, 
      token: localStorage.getItem('userToken')?.substring(0, 10) + '...',
      loading 
    });
    
    // Check localStorage directly
    const storedUserData = localStorage.getItem('user-data');
    console.log('[ACCOUNT] localStorage user data:', storedUserData ? 'Present' : 'Missing');
    
    // Log token details
    const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
    if (token) {
      console.log('[ACCOUNT] Token length:', token.length);
      try {
        // Try to decode and check expiration (JWT structure: header.payload.signature)
        const payload = token.split('.')[1];
        if (payload) {
          const decodedData = JSON.parse(atob(payload));
          console.log('[ACCOUNT] Token expiration:', new Date(decodedData.exp * 1000).toISOString());
        }
      } catch (err) {
        console.error('[ACCOUNT] Error decoding token:', err);
      }
    }
  }, [user, loading]);

  // Fetch the latest user data and order summary
  useEffect(() => {
    // Skip if we're already loading or a request is in progress
    if (requestInProgress.current) {
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        // Set flag to prevent concurrent requests
        requestInProgress.current = true;
        setLoading(true);
        setError(null);
        
        // Check if we've loaded recently
        const now = Date.now();
        if (now - lastDashboardLoad < DASHBOARD_COOLDOWN) {
          console.log('[DASHBOARD] Loading throttled, using cached data');
          
          try {
            // Try to use cached summary
            const cachedSummary = localStorage.getItem('cached-order-summary');
            if (cachedSummary) {
              setOrderSummary(JSON.parse(cachedSummary));
              setLoading(false);
              requestInProgress.current = false;
              return;
            }
          } catch (e) {
            console.warn('[DASHBOARD] Error reading from cache', e);
          }
        }
        
        // Update timestamp
        lastDashboardLoad = now;
        
        console.log('[DASHBOARD] Starting dashboard data fetch');
        
        // Refresh user data to ensure we have the latest
        if (refreshUserData) {
          console.log('[DASHBOARD] Refreshing user data');
          await refreshUserData();
        }
        
        // Fetch user's orders with better error handling
        console.log('[DASHBOARD] Fetching order data');
        
        try {
          const orders = await orderService.getMyOrders();
          console.log('[DASHBOARD] Orders retrieved:', Array.isArray(orders) ? orders.length : 'not an array');
          
          // Calculate order summary
          const summary = orderService.calculateOrderSummary(orders);
          console.log('[DASHBOARD] Order summary calculated:', summary);
          setOrderSummary(summary);
          
          // Cache the summary
          try {
            localStorage.setItem('cached-order-summary', JSON.stringify(summary));
          } catch (e) {
            console.warn('[DASHBOARD] Error caching summary', e);
          }
        } catch (orderError) {
          console.error('[DASHBOARD] Error fetching orders:', orderError);
          // Don't fail completely if orders can't be fetched
          const emptySummary = {
            totalOrders: 0,
            totalAmount: 0,
            paidOrders: 0,
            unPaidOrders: 0,
            deliveredOrders: 0,
            pendingDelivery: 0
          };
          setOrderSummary(emptySummary);
          
          // Try to use cached summary as fallback
          try {
            const cachedSummary = localStorage.getItem('cached-order-summary');
            if (cachedSummary) {
              setOrderSummary(JSON.parse(cachedSummary));
            }
          } catch (e) {
            console.warn('[DASHBOARD] Error reading from cache', e);
          }
        }
      } catch (error) {
        console.error('[DASHBOARD] Error fetching dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
        requestInProgress.current = false;
      }
    };
    
    // Only fetch if we have a user
    if (user) {
      fetchDashboardData();
    } else if (!loading) {
      // If not loading and no user, set empty state
      setOrderSummary({
        totalOrders: 0,
        totalAmount: 0,
        paidOrders: 0,
        unPaidOrders: 0,
        deliveredOrders: 0,
        pendingDelivery: 0
      });
      setLoading(false);
    }
  }, [refreshUserData, user, loading]);
  
  // Show direct error message if there's a problem
  if (error && !loading) {
    return (
      <div className={styles.errorContainer || 'error-container'}>
        <h2>Erreur de chargement</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={styles.retryButton || 'retry-button'}
        >
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeHeader}>
        <h1>Mon Compte</h1>
        <p className={styles.welcomeMessage}>
          Bienvenue dans votre espace personnel, {user?.name || 'cher client'}. Votre parcours d'élégance se reflète ici.
        </p>
      </div>
      
      <AccountOverview 
        user={user}
        orderSummary={orderSummary}
        loading={loading}
      />
    </div>
  );
}