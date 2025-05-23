'use client';

import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';
import Modal from '@/components/admin/Modal';
import OrderDetails from '@/components/admin/OrderDetails';
import StatusUpdateForm from '@/components/admin/StatusUpdateForm';
import styles from './AdminOrders.module.css';

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

  const getStatusDisplay = (order) => {
    if (order.isCancelled) return { label: "Annulé", style: "bg-red-100 text-red-800" };
    if (order.isDelivered) return { label: "Livré", style: "bg-green-100 text-green-800" };
    if (order.isShipped) return { label: "Expédié", style: "bg-blue-100 text-blue-800" };
    if (order.isPaid) return { label: "En traitement", style: "bg-indigo-100 text-indigo-800" };
    return { label: "En attente", style: "bg-yellow-100 text-yellow-800" };
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Gestion des commandes</h1>
          <p className={styles.pageDescription}>Gérez et suivez les commandes des clients</p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className={styles.filterSection}>
          <div className={styles.searchFilterRow}>
            <input
              type="text"
              placeholder="Rechercher par ID, client, email, téléphone..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className={styles.filterControls}>
              <select 
                className={styles.filterSelect}
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
                className={styles.filterSelect}
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
                <div className={styles.dateRangeContainer}>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                    aria-label="Date de début"
                  />
                  <span className="self-center">à</span>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                    aria-label="Date de fin"
                  />
                </div>
              )}
              
              <button 
                className={styles.resetButton}
                onClick={resetFilters}
                aria-label="Réinitialiser les filtres"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Orders Summary Cards */}
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>Total commandes</div>
              <div className={styles.summaryValue}>{summary.total}</div>
            </div>
            
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>En attente</div>
              <div className={styles.summaryValue}>{summary.pending}</div>
            </div>
            
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>En traitement</div>
              <div className={styles.summaryValue}>{summary.processing}</div>
            </div>
            
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>
                <span className="inline-block mr-1">Livrées</span>
                <span className="inline-block text-xs bg-green-100 text-green-800 px-1 rounded">
                  {Math.round((summary.delivered / summary.total) * 100) || 0}%
                </span>
              </div>
              <div className={styles.summaryValue}>{summary.delivered}</div>
            </div>
          </div>
        </div>
        
        {/* Orders Table/List */}
        <div className={styles.pageContent}>
          {loading ? (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinnerAnimation}></div>
            </div>
          ) : (
            <div>
              {filteredOrders.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateText}>Aucune commande trouvée</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead className={styles.tableHeader}>
                        <tr>
                          <th scope="col" className={styles.tableHeaderCell}>
                            Commande
                          </th>
                          <th scope="col" className={styles.tableHeaderCell}>
                            Date
                          </th>
                          <th scope="col" className={styles.tableHeaderCell}>
                            Client
                          </th>
                          <th scope="col" className={styles.tableHeaderCell}>
                            Total
                          </th>
                          <th scope="col" className={styles.tableHeaderCell}>
                            Statut
                          </th>
                          <th scope="col" className={styles.tableHeaderCell}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => {
                          const status = getStatusDisplay(order);
                          return (
                            <tr key={order._id} className={styles.tableRow}>
                              <td className={styles.tableCell}>
                                <div className={styles.orderIdText}>
                                  #{order.orderNumber || order._id.substr(-6)}
                                </div>
                              </td>
                              <td className={styles.tableCell}>
                                <div className={styles.dateText}>{formatDate(order.createdAt)}</div>
                              </td>
                              <td className={styles.tableCell}>
                                <div className={styles.customerName}>{order.user?.name || 'Client inconnu'}</div>
                                <div className={styles.customerEmail}>{order.user?.email || ''}</div>
                              </td>
                              <td className={styles.tableCell}>
                                <div className={styles.priceText}>{formatPrice(order.totalPrice)}</div>
                              </td>
                              <td className={styles.tableCell}>
                                <span className={`${styles.statusBadge} ${status.style}`}>
                                  {status.label}
                                </span>
                              </td>
                              <td className={styles.actionCell}>
                                <button 
                                  className={styles.viewButton}
                                  onClick={() => handleViewOrder(order)}
                                  aria-label="Voir les détails de la commande"
                                >
                                  Voir
                                </button>
                                <button 
                                  className={styles.updateButton}
                                  onClick={() => handleUpdateStatus(order)}
                                  aria-label="Modifier le statut de la commande"
                                >
                                  Modifier
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className={styles.mobileCardContainer}>
                    {filteredOrders.map((order) => {
                      const status = getStatusDisplay(order);
                      return (
                        <div key={order._id} className={styles.mobileCard}>
                          <div className={styles.mobileCardHeader}>
                            <span className={styles.orderIdText}>
                              #{order.orderNumber || order._id.substr(-6)}
                            </span>
                            <span className={`${styles.statusBadge} ${status.style}`}>
                              {status.label}
                            </span>
                          </div>
                          
                          <div className={styles.mobileCustomerInfo}>
                            <div className={styles.mobileCustomerName}>{order.user?.name || 'Client inconnu'}</div>
                            <div className={styles.mobileCustomerEmail}>{order.user?.email || ''}</div>
                          </div>
                          
                          <div className={styles.mobileCardFooter}>
                            <span className={styles.mobileDate}>{formatDate(order.createdAt)}</span>
                            <span className={styles.mobilePrice}>{formatPrice(order.totalPrice)}</span>
                          </div>
                          
                          <div className={styles.mobileActionBar}>
                            <button 
                              className={styles.mobileViewButton}
                              onClick={() => handleViewOrder(order)}
                              aria-label="Voir les détails de la commande"
                            >
                              Détails
                            </button>
                            <button 
                              className={styles.mobileUpdateButton}
                              onClick={() => handleUpdateStatus(order)}
                              aria-label="Modifier le statut de la commande"
                            >
                              Modifier
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

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
      </div>
    </AdminLayout>
  );
}