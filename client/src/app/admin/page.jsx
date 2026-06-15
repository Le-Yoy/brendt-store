// client/src/app/admin/page.jsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import adminService from '@/services/adminService';
import api from '@/utils/api/apiUtils';
import StatsCard from '@/components/admin/StatsCard';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotification } from '@/contexts/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './admin-dashboard.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showError } = useNotification();
  
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Format a month-over-month growth value as a signed percentage,
  // or null when no value is available (hides the badge entirely).
  const formatChange = (value) =>
    value === null || value === undefined ? null : `${value >= 0 ? '+' : ''}${value}%`;
  const changeTypeFor = (value) => (value >= 0 ? 'increase' : 'decrease');

  // Relative French time label for an order's createdAt, with an absolute fallback.
  const formatRelativeDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH} h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `Il y a ${diffD} j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        console.log('[ADMIN] Initiating dashboard data fetch');

        // Skip token validation and rely on useAuth hook
        if (!user || user.role !== 'admin') {
          console.error('[ADMIN] User is not admin or not authenticated');
          router.push('/login?redirect=/admin');
          return;
        }

        // Try to get real data from the API
        const response = await adminService.getDashboardStats();
        console.log('[ADMIN] Dashboard data received:', response);

        // Validate the structure of the response
        if (!response || !response.salesSummary) {
          console.error('[ADMIN] Invalid response structure:', response);
          throw new Error('Invalid response structure from API');
        }

        setStats(response);

        // Fetch the most recent orders for the "Activité récente" feed.
        // This is non-critical: a failure here must not break the dashboard.
        try {
          const ordersResponse = await adminService.getOrders();
          const orders = Array.isArray(ordersResponse?.data) ? ordersResponse.data : [];
          setRecentOrders(orders.slice(0, 5));
        } catch (ordersError) {
          console.error('[ADMIN] Could not load recent orders:', ordersError);
          setRecentOrders([]);
        }
      } catch (error) {
        console.error('[ADMIN] Error fetching dashboard data:', error);

        // Never fabricate numbers — show an honest error state instead.
        setStats(null);
        if (error.status === 401) {
          setLoadError('Session expirée. Veuillez vous reconnecter.');
          showError('Session expirée. Veuillez vous reconnecter.');
        } else if (error.status === 403) {
          setLoadError('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
          showError('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
        } else {
          setLoadError('Impossible de charger les données du tableau de bord. Vérifiez votre connexion et réessayez.');
          showError('Impossible de charger les données du tableau de bord.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data only if user is admin and not in loading state
    if (!loading) {
      if (user && user.role === 'admin') {
        console.log('[ADMIN] User is admin, fetching dashboard data');
        fetchDashboardData();
      } else if (user) {
        console.warn('[ADMIN] User is not admin, redirecting');
        router.push('/');
      }
    }
  }, [user, loading, router, showError]);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login?redirect=/admin');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Tableau de bord BRENDT</h1>
          <p className={styles.pageSubtitle}>Bienvenue, {user.name}. Voici un aperçu de votre boutique.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : loadError ? (
          <div className={styles.errorState} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-error, #dc2626)' }}>
              {loadError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className={styles.quickActionButton}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <StatsCard
                title="Commandes totales"
                value={stats?.salesSummary?.ordersCount || 0}
                description="Commandes depuis la création"
                icon={
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
                change={formatChange(stats?.salesSummary?.salesGrowth)}
                changeType={changeTypeFor(stats?.salesSummary?.salesGrowth)}
              />
              <StatsCard
                title="Chiffre d'affaires"
                value={`${stats?.salesSummary?.totalSales?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`}
                description="Revenu total généré"
                icon={
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                change={formatChange(stats?.salesSummary?.salesGrowth)}
                changeType={changeTypeFor(stats?.salesSummary?.salesGrowth)}
              />
              <StatsCard
                title="Clients"
                value={stats?.customerMetrics?.totalCustomers || 0}
                description="Clients enregistrés"
                icon={
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                change={formatChange(stats?.customerMetrics?.customerGrowth)}
                changeType={changeTypeFor(stats?.customerMetrics?.customerGrowth)}
              />
              <StatsCard
                title="Panier moyen"
                value={`${stats?.salesSummary?.averageOrderValue?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`}
                description="Valeur moyenne des commandes"
                icon={
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
            </div>

            {/* Charts Section */}
            <div className={styles.graphGrid}>
              {/* Sales Chart */}
              <div className={styles.graphCard}>
                <h2 className={styles.graphTitle}>Ventes par période</h2>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats?.salesByPeriod || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString('fr-FR')} DH`, 'Ventes']}
                        labelFormatter={(label) => `Période: ${label}`}
                      />
                      <Bar dataKey="sales" fill="var(--color-accent)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Products */}
              <div className={styles.graphCard}>
                <h2 className={styles.graphTitle}>Produits les plus vendus</h2>
                <div className={styles.topProductsList}>
                  {stats?.topSellingProducts?.slice(0, 5).map((product, index) => (
                    <div key={product.id} className={styles.topProductItem}>
                      <div className={styles.productRank}>
                        {index + 1}
                      </div>
                      <div className={styles.productInfo}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productSales}>{product.sales} unités vendues</p>
                      </div>
                      <div className={styles.productRevenue}>{product.revenue.toLocaleString('fr-FR')} DH</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActionsCard}>
              <h2 className={styles.quickActionsTitle}>Actions rapides</h2>
              <div className={styles.quickActionsGrid}>
                <button 
                  onClick={() => router.push('/admin/products')}
                  className={styles.quickActionButton}
                >
                  <svg className={`${styles.quickActionIcon} h-5 w-5`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter un produit
                </button>
                <button 
                  onClick={() => router.push('/admin/inventory')}
                  className={styles.quickActionButton}
                >
                  <svg className={`${styles.quickActionIcon} h-5 w-5`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Gérer l'inventaire
                </button>
                <button 
                  onClick={() => router.push('/admin/orders')}
                  className={styles.quickActionButton}
                >
                  <svg className={`${styles.quickActionIcon} h-5 w-5`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Voir les commandes
                </button>
                <button 
                  onClick={() => router.push('/admin/forms')}
                  className={styles.quickActionButton}
                >
                  <svg className={`${styles.quickActionIcon} h-5 w-5`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.2 3.4c.5 0 .9.2 1.2.5l1.7 1.7c.3.3.5.7.5 1.2v2.6c0 .5-.2.9-.5 1.2L12 19.5V22H4v-7.5l8.9-9c.3-.2.7-.4 1.1-.4h3.2zM10.5 16L17 9.5 14.5 7 8 13.5v2.5h2.5z" />
                  </svg>
                  Formulaires clients
                </button>
              </div>
            </div>

            {/* Recent Activity — real most-recent orders */}
            <div className={styles.recentActivityCard}>
              <h2 className={styles.recentActivityTitle}>Commandes récentes</h2>
              <div className={styles.activityList}>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => {
                    const total = typeof order.totalPrice === 'number'
                      ? `${order.totalPrice.toLocaleString('fr-FR')} DH`
                      : '';
                    const customer = order.user?.name || order.shippingAddress?.fullName || 'Client';
                    return (
                      <button
                        key={order._id}
                        onClick={() => router.push('/admin/orders')}
                        className={`${styles.activityItem} ${index === 0 ? styles.activityItemActive : styles.activityItemInactive}`}
                        style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        <div className={styles.activityTitle}>
                          Commande #{order.orderNumber || order._id.substr(-6)} — {customer} {total && `· ${total}`}
                        </div>
                        <div className={styles.activityTime}>{formatRelativeDate(order.createdAt)}</div>
                      </button>
                    );
                  })
                ) : (
                  <div className={styles.activityItem}>
                    <div className={styles.activityTitle}>Aucune commande récente</div>
                  </div>
                )}
              </div>
              <button
                onClick={() => router.push('/admin/orders')}
                className={styles.viewAllLink}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Voir toutes les commandes →
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}