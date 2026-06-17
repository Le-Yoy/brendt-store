// client/src/app/admin/page.jsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import adminService from '@/services/adminService';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotification } from '@/contexts/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { showError } = useNotification();

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Render a signed month-over-month delta, or nothing when unavailable.
  const renderDelta = (value) => {
    if (value === null || value === undefined) return null;
    const cls = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
    const arrow = value > 0 ? '↑' : value < 0 ? '↓' : '·';
    return <div className={`adm-stat-delta ${cls}`}>{arrow} {Math.abs(value)}% ce mois</div>;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        if (!user || user.role !== 'admin') {
          router.push('/login?redirect=/admin');
          return;
        }

        const response = await adminService.getDashboardStats();

        if (!response || !response.salesSummary) {
          throw new Error('Invalid response structure from API');
        }

        setStats(response);

        // Recent orders feed — non-critical: a failure here must not break the dashboard.
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
          setLoadError("Vous n'avez pas les permissions nécessaires pour accéder à cette page.");
          showError("Vous n'avez pas les permissions nécessaires pour accéder à cette page.");
        } else {
          setLoadError('Impossible de charger les données du tableau de bord. Vérifiez votre connexion et réessayez.');
          showError('Impossible de charger les données du tableau de bord.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      if (user && user.role === 'admin') {
        fetchDashboardData();
      } else if (user) {
        router.push('/');
      }
    }
  }, [user, loading, router, showError]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login?redirect=/admin');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="admin-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="adm-spinner" />
      </div>
    );
  }

  const fmtMoney = (n) =>
    typeof n === 'number' ? `${n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH` : '—';

  return (
    <AdminLayout>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Tableau de bord</h1>
        <p className="adm-page-sub">Bienvenue, {user.name}. Voici un aperçu de votre boutique.</p>
      </div>

      {isLoading ? (
        <div className="adm-spinner" />
      ) : loadError ? (
        <div className="adm-error">
          <p className="adm-error-msg">{loadError}</p>
          <button className="adm-btn adm-btn--primary" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      ) : (
        <>
          {/* Stat tiles */}
          <div className="adm-stats-grid">
            <div className="adm-stat">
              <div className="adm-stat-label">Commandes totales</div>
              <div className="adm-stat-value">{stats?.salesSummary?.ordersCount ?? 0}</div>
              <div className="adm-stat-desc">Depuis la création</div>
              {renderDelta(stats?.salesSummary?.salesGrowth)}
            </div>
            <div className="adm-stat">
              <div className="adm-stat-label">Chiffre d'affaires</div>
              <div className="adm-stat-value">{fmtMoney(stats?.salesSummary?.totalSales)}</div>
              <div className="adm-stat-desc">Revenu total généré</div>
              {renderDelta(stats?.salesSummary?.salesGrowth)}
            </div>
            <div className="adm-stat">
              <div className="adm-stat-label">Clients</div>
              <div className="adm-stat-value">{stats?.customerMetrics?.totalCustomers ?? 0}</div>
              <div className="adm-stat-desc">Clients enregistrés</div>
              {renderDelta(stats?.customerMetrics?.customerGrowth)}
            </div>
            <div className="adm-stat">
              <div className="adm-stat-label">Panier moyen</div>
              <div className="adm-stat-value">{fmtMoney(stats?.salesSummary?.averageOrderValue)}</div>
              <div className="adm-stat-desc">Valeur moyenne par commande</div>
            </div>
          </div>

          {/* Charts */}
          <div className="adm-grid-2 adm-mb-lg">
            <div className="adm-card adm-card-pad">
              <h2 className="adm-card-title">Ventes par période</h2>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.salesByPeriod || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ececef" vertical={false} />
                    <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#9b9ba3' }} tickLine={false} axisLine={{ stroke: '#e7e7ea' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#9b9ba3' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value) => [`${Number(value).toLocaleString('fr-FR')} DH`, 'Ventes']}
                      labelFormatter={(label) => `Période : ${label}`}
                      contentStyle={{ borderRadius: 8, border: '1px solid #e7e7ea', fontSize: 13 }}
                    />
                    <Bar dataKey="sales" fill="#111113" radius={[4, 4, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="adm-card adm-card-pad">
              <h2 className="adm-card-title">Produits les plus vendus</h2>
              {stats?.topSellingProducts?.length > 0 ? (
                <div className="adm-stack" style={{ gap: '.85rem' }}>
                  {stats.topSellingProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id || index} className="adm-row" style={{ justifyContent: 'space-between' }}>
                      <div className="adm-row">
                        <span
                          style={{
                            width: 24, height: 24, borderRadius: 6, flex: '0 0 auto',
                            background: 'var(--adm-surface-2)', color: 'var(--adm-text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '.78rem', fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </span>
                        <div className="adm-stack" style={{ gap: '.1rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{product.name}</span>
                          <span style={{ fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>{product.sales} unités vendues</span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '.88rem', whiteSpace: 'nowrap' }}>
                        {Number(product.revenue).toLocaleString('fr-FR')} DH
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="adm-empty" style={{ padding: '1.5rem 0' }}>Aucune vente enregistrée</div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="adm-card adm-card-pad adm-mb-lg">
            <h2 className="adm-card-title">Actions rapides</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem' }}>
              <button className="adm-btn" onClick={() => router.push('/admin/products')}>Ajouter un produit</button>
              <button className="adm-btn" onClick={() => router.push('/admin/inventory')}>Gérer l'inventaire</button>
              <button className="adm-btn" onClick={() => router.push('/admin/orders')}>Voir les commandes</button>
              <button className="adm-btn" onClick={() => router.push('/admin/analytics')}>Analytique</button>
            </div>
          </div>

          {/* Recent orders */}
          <div className="adm-card">
            <div className="adm-card-pad" style={{ borderBottom: '1px solid var(--adm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="adm-card-title" style={{ margin: 0 }}>Commandes récentes</h2>
              <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => router.push('/admin/orders')}>
                Tout voir →
              </button>
            </div>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const total = typeof order.totalPrice === 'number' ? `${order.totalPrice.toLocaleString('fr-FR')} DH` : '';
                const customer = order.user?.name || order.shippingAddress?.fullName || 'Client';
                return (
                  <button
                    key={order._id}
                    onClick={() => router.push('/admin/orders')}
                    style={{
                      display: 'flex', width: '100%', textAlign: 'left', alignItems: 'center', justifyContent: 'space-between',
                      gap: '1rem', padding: '.85rem 1.25rem', borderBottom: '1px solid var(--adm-border)',
                      background: 'none', border: 'none', borderBottomWidth: 1, borderBottomStyle: 'solid', cursor: 'pointer',
                    }}
                  >
                    <div className="adm-stack" style={{ gap: '.15rem', minWidth: 0 }}>
                      <span style={{ fontWeight: 600, fontSize: '.9rem' }}>
                        #{order.orderNumber || order._id.substr(-6)} · {customer}
                      </span>
                      <span style={{ fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>{formatRelativeDate(order.createdAt)}</span>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '.88rem', whiteSpace: 'nowrap' }}>{total}</span>
                  </button>
                );
              })
            ) : (
              <div className="adm-empty">Aucune commande récente</div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
