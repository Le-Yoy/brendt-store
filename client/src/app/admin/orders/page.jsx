'use client';

import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';
import Modal from '@/components/admin/Modal';
import OrderDetails from '@/components/admin/OrderDetails';
import StatusUpdateForm from '@/components/admin/StatusUpdateForm';

export default function AdminOrdersPage() {
  const { showSuccess, showError } = useNotification();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'update'

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: ""
  });

  // Summary counts
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getOrders();
      console.log('Orders API Response:', response);

      // Extract orders data properly
      if (response && response.data && Array.isArray(response.data)) {
        console.log(`Setting ${response.data.length} orders from API`);
        setOrders(response.data);
        setFilteredOrders(response.data); // Initialize filtered orders
      } else {
        console.warn('Unexpected response format:', response);
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      showError('Erreur lors du chargement des commandes', {
        title: 'Erreur de données'
      });
      console.error('Error fetching orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Calculate summary counts when orders change
  useEffect(() => {
    const newSummary = {
      total: filteredOrders.length,
      pending: filteredOrders.filter(order => !order.isPaid && !order.isCancelled).length,
      processing: filteredOrders.filter(order => order.isPaid && !order.isShipped && !order.isDelivered && !order.isCancelled).length,
      shipped: filteredOrders.filter(order => order.isShipped && !order.isDelivered && !order.isCancelled).length,
      delivered: filteredOrders.filter(order => order.isDelivered).length,
      cancelled: filteredOrders.filter(order => order.isCancelled).length
    };
    setSummary(newSummary);
  }, [filteredOrders]);

  // Apply filters when criteria change
  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, dateFilter, dateRange]);

  // Filter functions
  const applyFilters = () => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(order =>
        (order._id && order._id.toLowerCase().includes(search)) ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(search)) ||
        (order.user?.name && order.user.name.toLowerCase().includes(search)) ||
        (order.user?.email && order.user.email.toLowerCase().includes(search)) ||
        (order.shippingAddress?.phoneNumber && order.shippingAddress.phoneNumber.includes(search))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => {
        if (statusFilter === 'pending') return !order.isPaid && !order.isCancelled;
        if (statusFilter === 'processing') return order.isPaid && !order.isShipped && !order.isDelivered && !order.isCancelled;
        if (statusFilter === 'shipped') return order.isShipped && !order.isDelivered && !order.isCancelled;
        if (statusFilter === 'delivered') return order.isDelivered;
        if (statusFilter === 'cancelled') return order.isCancelled;
        return true;
      });
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate;

      if (dateFilter === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (dateFilter === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startDate.setHours(0, 0, 0, 0);
      } else if (dateFilter === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of month
      } else if (dateFilter === 'custom' && dateRange.from) {
        startDate = new Date(dateRange.from);
      }

      if (startDate) {
        result = result.filter(order => new Date(order.createdAt) >= startDate);
      }

      if (dateFilter === 'custom' && dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999); // End of the selected day
        result = result.filter(order => new Date(order.createdAt) <= endDate);
      }
    }

    setFilteredOrders(result);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setDateRange({ from: "", to: "" });
    setFilteredOrders(orders);
  };

  // Action handlers
  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (order) => {
    setCurrentOrder(order || currentOrder);
    setModalMode('update');
    setIsModalOpen(true);
  };

  const handleStatusUpdateSuccess = (message, isError = false) => {
    if (isError) {
      showError(message);
    } else {
      showSuccess(message);
    }
    fetchOrders(); // Refresh the orders list
    setIsModalOpen(false);
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }) || '0,00 MAD';
  };

  // Map an order to a label + monochrome badge variant.
  const getStatusDisplay = (order) => {
    if (order.isCancelled) return { label: "Annulé", cls: "adm-badge--danger" };
    if (order.isDelivered) return { label: "Livré", cls: "adm-badge--ok" };
    if (order.isShipped) return { label: "Expédié", cls: "adm-badge--muted" };
    if (order.isPaid) return { label: "En traitement", cls: "adm-badge--warn" };
    return { label: "En attente", cls: "adm-badge--warn" };
  };

  return (
    <AdminLayout>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Gestion des commandes</h1>
        <p className="adm-page-sub">Gérez et suivez les commandes des clients.</p>
      </div>

      {/* Summary stat tiles */}
      <div className="adm-stats-grid">
        <div className="adm-stat">
          <div className="adm-stat-label">Total commandes</div>
          <div className="adm-stat-value">{summary.total}</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-label">En attente</div>
          <div className="adm-stat-value">{summary.pending}</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-label">En traitement</div>
          <div className="adm-stat-value">{summary.processing}</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-label">Livrées</div>
          <div className="adm-stat-value">{summary.delivered}</div>
          <div className="adm-stat-desc">
            {Math.round((summary.delivered / summary.total) * 100) || 0}% du total
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="adm-toolbar">
        <input
          type="text"
          placeholder="Rechercher par ID, client, email, téléphone…"
          className="adm-input"
          style={{ minWidth: 260, flex: 1 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="adm-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrer par statut"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processing">En traitement</option>
          <option value="shipped">Expédié</option>
          <option value="delivered">Livré</option>
          <option value="cancelled">Annulé</option>
        </select>

        <select
          className="adm-select"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filtrer par date"
        >
          <option value="all">Toute période</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="custom">Période personnalisée</option>
        </select>

        {dateFilter === 'custom' && (
          <div className="adm-row" style={{ gap: '.4rem' }}>
            <input
              type="date"
              className="adm-input"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              aria-label="Date de début"
            />
            <span style={{ color: 'var(--adm-text-muted)' }}>à</span>
            <input
              type="date"
              className="adm-input"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              aria-label="Date de fin"
            />
          </div>
        )}

        <div className="adm-toolbar-spacer" />

        <button
          className="adm-btn adm-btn--ghost"
          onClick={resetFilters}
          aria-label="Réinitialiser les filtres"
        >
          Réinitialiser
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="adm-spinner" />
      ) : filteredOrders.length === 0 ? (
        <div className="adm-card">
          <div className="adm-empty">
            <div className="adm-empty-title">Aucune commande</div>
            Aucune commande ne correspond à vos filtres.
          </div>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Commande</th>
                <th scope="col">Date</th>
                <th scope="col">Client</th>
                <th scope="col">Total</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const status = getStatusDisplay(order);
                return (
                  <tr key={order._id}>
                    <td className="adm-cell-strong">
                      #{order.orderNumber || order._id.substr(-6)}
                    </td>
                    <td className="adm-cell-muted">{formatDate(order.createdAt)}</td>
                    <td>
                      <div className="adm-cell-strong">{order.user?.name || order.shippingAddress?.fullName || 'Client inconnu'}</div>
                      <div className="adm-cell-muted" style={{ fontSize: '.78rem' }}>
                        {order.user?.email || order.shippingAddress?.phoneNumber || ''}
                      </div>
                    </td>
                    <td className="adm-cell-strong">{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className={`adm-badge ${status.cls}`}>{status.label}</span>
                    </td>
                    <td>
                      <div className="adm-row" style={{ gap: '.4rem' }}>
                        <button
                          className="adm-btn adm-btn--sm"
                          onClick={() => handleViewOrder(order)}
                          aria-label="Voir les détails de la commande"
                        >
                          Voir
                        </button>
                        <button
                          className="adm-btn adm-btn--primary adm-btn--sm"
                          onClick={() => handleUpdateStatus(order)}
                          aria-label="Modifier le statut de la commande"
                        >
                          Modifier
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details/Update Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            modalMode === 'view'
              ? `Détails de la commande #${currentOrder?.orderNumber || currentOrder?._id?.substr(-6) || 'N/A'}`
              : `Modifier le statut de la commande #${currentOrder?.orderNumber || currentOrder?._id?.substr(-6) || 'N/A'}`
          }
          size="large"
        >
          {modalMode === 'view' && currentOrder && (
            <OrderDetails
              order={currentOrder}
              onClose={() => setIsModalOpen(false)}
              onStatusUpdate={() => handleUpdateStatus()}
            />
          )}
          {modalMode === 'update' && currentOrder && (
            <StatusUpdateForm
              order={currentOrder}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleStatusUpdateSuccess}
            />
          )}
        </Modal>
      )}
    </AdminLayout>
  );
}
