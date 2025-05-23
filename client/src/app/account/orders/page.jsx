// src/app/account/orders/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { orderService } from '../../../services';
import OrderList from '../../../components/account/OrderHistory/OrderList';
import styles from './orders.module.css';
import { FiFilter, FiCalendar, FiPackage } from 'react-icons/fi';

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('[ORDERS] Fetching user orders...');
        setLoading(true);
        const orderData = await orderService.getMyOrders();
        console.log('[ORDERS] Orders received:', orderData);
        
        if (Array.isArray(orderData)) {
          setOrders(orderData);
          setFilteredOrders(orderData);
          setError(null);
        } else {
          console.error('[ORDERS] Received non-array order data:', orderData);
          setOrders([]);
          setFilteredOrders([]);
          setError('Format des données de commande incorrect.');
        }
      } catch (err) {
        console.error('[ORDERS] Error fetching orders:', err);
        setError('Impossible de charger vos commandes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let filterDate = new Date();
      
      switch (dateFilter) {
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear(), 0, 1);
          break;
      }
      
      filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => {
        if (statusFilter === 'processing') return !order.isDelivered && order.isPaid;
        if (statusFilter === 'shipped') return order.isShipped && !order.isDelivered;
        if (statusFilter === 'delivered') return order.isDelivered;
        if (statusFilter === 'canceled') return order.isCanceled;
        return true;
      });
    }
    
    setFilteredOrders(filtered);
  }, [dateFilter, statusFilter, orders]);

  return (
    <div className={styles.ordersPage}>
      <div className={styles.pageHeader}>
        <h1>Mes Commandes</h1>
        <p className={styles.pageSubtitle}>
          Votre voyage avec nous se reflète dans chaque pas
        </p>
      </div>
      
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <FiCalendar />
            <span>Période</span>
          </div>
          <div className={styles.filterOptions}>
            <button 
              className={`${styles.filterButton} ${dateFilter === 'all' ? styles.active : ''}`}
              onClick={() => setDateFilter('all')}
            >
              Toutes
            </button>
            <button 
              className={`${styles.filterButton} ${dateFilter === '30days' ? styles.active : ''}`}
              onClick={() => setDateFilter('30days')}
            >
              30 derniers jours
            </button>
            <button 
              className={`${styles.filterButton} ${dateFilter === '3months' ? styles.active : ''}`}
              onClick={() => setDateFilter('3months')}
            >
              3 derniers mois
            </button>
            <button 
              className={`${styles.filterButton} ${dateFilter === '6months' ? styles.active : ''}`}
              onClick={() => setDateFilter('6months')}
            >
              6 derniers mois
            </button>
            <button 
              className={`${styles.filterButton} ${dateFilter === 'year' ? styles.active : ''}`}
              onClick={() => setDateFilter('year')}
            >
              Année en cours
            </button>
          </div>
        </div>
        
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <FiPackage />
            <span>Statut</span>
          </div>
          <div className={styles.filterOptions}>
            <button 
              className={`${styles.filterButton} ${statusFilter === 'all' ? styles.active : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Toutes
            </button>
            <button 
              className={`${styles.filterButton} ${statusFilter === 'processing' ? styles.active : ''}`}
              onClick={() => setStatusFilter('processing')}
            >
              En cours
            </button>
            <button 
              className={`${styles.filterButton} ${statusFilter === 'shipped' ? styles.active : ''}`}
              onClick={() => setStatusFilter('shipped')}
            >
              Expédiées
            </button>
            <button 
              className={`${styles.filterButton} ${statusFilter === 'delivered' ? styles.active : ''}`}
              onClick={() => setStatusFilter('delivered')}
            >
              Livrées
            </button>
            <button 
              className={`${styles.filterButton} ${statusFilter === 'canceled' ? styles.active : ''}`}
              onClick={() => setStatusFilter('canceled')}
            >
              Annulées
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement de vos commandes...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}></div>
          <h2>Vous n'avez pas encore de commande</h2>
          <p>Votre parcours d'élégance commence avec votre premier pas</p>
          <a href="/category/chaussures" className={styles.discoverButton}>
            Découvrir nos collections
          </a>
        </div>
      ) : (
        <OrderList orders={filteredOrders} />
      )}
    </div>
  );
}