'use client';

import React, { useState, useEffect } from 'react';
import styles from './CustomerInsights.module.css';
import adminService from '@/services/adminService';
import { useNotification } from '@/contexts/NotificationContext';

const CustomerInsights = ({ customerId }) => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { showError } = useNotification();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const orderHistory = await adminService.getCustomerOrderHistory(customerId);
        const interactions = await adminService.getCustomerInteractions(customerId);
        
        setCustomerData({
          orderHistory: orderHistory.data || {},
          interactions: interactions.data || {}
        });
      } catch (error) {
        console.error('Error fetching customer insights:', error);
        showError('Erreur lors du chargement des données client', {
          title: 'Erreur de données'
        });
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId, showError]);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount?.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }) || '0,00 MAD';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading || "p-4 flex justify-center"}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className={styles.error || "p-4 text-center"}>
        <p>Aucune donnée client disponible</p>
      </div>
    );
  }

  const { orderHistory, interactions } = customerData;
  const { customer, orders = [], metrics = {}, preferences = [] } = orderHistory;

  return (
    <div className={styles.container || "bg-white rounded-lg shadow overflow-hidden"}>
      {/* Customer header */}
      <div className={styles.customerHeader || "bg-gray-50 p-4 border-b"}>
        <h2 className={styles.customerName || "text-xl font-semibold text-gray-800"}>
          {customer?.name || 'Client'}
        </h2>
        <div className={styles.customerMeta || "text-sm text-gray-500 mt-1"}>
          <span>{customer?.email || 'Pas d\'email'}</span>
          <span className="mx-2">•</span>
          <span>Client depuis {formatDate(customer?.createdAt)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs || "flex border-b"}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`${styles.tab || "px-4 py-2 font-medium text-sm"} ${
            activeTab === 'overview' ? styles.activeTab || 'border-b-2 border-accent text-accent' : 'text-gray-500'
          }`}
        >
          Aperçu
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${styles.tab || "px-4 py-2 font-medium text-sm"} ${
            activeTab === 'orders' ? styles.activeTab || 'border-b-2 border-accent text-accent' : 'text-gray-500'
          }`}
        >
          Commandes
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`${styles.tab || "px-4 py-2 font-medium text-sm"} ${
            activeTab === 'interactions' ? styles.activeTab || 'border-b-2 border-accent text-accent' : 'text-gray-500'
          }`}
        >
          Interactions
        </button>
      </div>

      {/* Content */}
      <div className={styles.content || "p-4"}>
        {activeTab === 'overview' && (
          <div className={styles.overview || ""}>
            {/* Customer metrics */}
            <div className={styles.metricsGrid || "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"}>
              <div className={styles.metricCard || "bg-gray-50 p-4 rounded-lg"}>
                <div className={styles.metricLabel || "text-sm text-gray-500"}>Total des commandes</div>
                <div className={styles.metricValue || "text-2xl font-semibold mt-1"}>{metrics.totalOrders || 0}</div>
              </div>
              
              <div className={styles.metricCard || "bg-gray-50 p-4 rounded-lg"}>
                <div className={styles.metricLabel || "text-sm text-gray-500"}>Dépenses totales</div>
                <div className={styles.metricValue || "text-2xl font-semibold mt-1"}>{formatCurrency(metrics.totalSpent)}</div>
              </div>
              
              <div className={styles.metricCard || "bg-gray-50 p-4 rounded-lg"}>
                <div className={styles.metricLabel || "text-sm text-gray-500"}>Valeur moyenne</div>
                <div className={styles.metricValue || "text-2xl font-semibold mt-1"}>{formatCurrency(metrics.avgOrderValue)}</div>
              </div>
              
              <div className={styles.metricCard || "bg-gray-50 p-4 rounded-lg"}>
                <div className={styles.metricLabel || "text-sm text-gray-500"}>Dernière commande</div>
                <div className={styles.metricValue || "text-xl font-semibold mt-1"}>
                  {orders.length > 0 ? formatDate(orders[0].createdAt) : 'Jamais'}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className={styles.preferencesSection || "mb-6"}>
              <h3 className={styles.sectionTitle || "text-lg font-medium text-gray-800 mb-3"}>Préférences d'achat</h3>
              
              {preferences.length > 0 ? (
                <div className={styles.preferencesList || "bg-gray-50 p-4 rounded-lg"}>
                  <h4 className={styles.preferencesTitle || "text-sm font-medium text-gray-500 mb-2"}>Catégories préférées</h4>
                  <div className={styles.preferenceCategories || "space-y-2"}>
                    {preferences.map((pref, index) => (
                      <div key={index} className={styles.categoryItem || "flex justify-between items-center"}>
                        <span className={styles.categoryName || "text-gray-800"}>{pref._id}</span>
                        <span className={styles.categoryCount || "text-sm bg-gray-200 text-gray-700 rounded-full px-2 py-0.5"}>
                          {pref.count} produits
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.noPreferences || "text-gray-500 italic"}>
                  Pas assez de données pour déterminer les préférences
                </div>
              )}
            </div>

            {/* Recent Orders Summary */}
            <div className={styles.recentOrders || "mb-6"}>
              <h3 className={styles.sectionTitle || "text-lg font-medium text-gray-800 mb-3"}>Commandes récentes</h3>
              
              {orders.length > 0 ? (
                <div className={styles.recentOrdersList || "space-y-3"}>
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className={styles.orderCard || "bg-gray-50 p-3 rounded-lg"}>
                      <div className={styles.orderHeader || "flex justify-between items-center mb-2"}>
                        <span className={styles.orderId || "text-sm font-medium text-accent"}>#{order._id.substr(-6)}</span>
                        <span className={styles.orderDate || "text-xs text-gray-500"}>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className={styles.orderDetails || "flex justify-between items-center"}>
                        <div className={styles.orderItems || "text-sm text-gray-700"}>
                          {order.orderItems?.length || 0} article(s)
                        </div>
                        <div className={styles.orderTotal || "font-medium"}>{formatCurrency(order.totalPrice)}</div>
                      </div>
                      <div className={styles.orderStatus || "mt-2"}>
                        <span className={`${styles.statusBadge || "text-xs px-2 py-0.5 rounded-full"} ${
                          order.isDelivered ? "bg-green-100 text-green-800" : 
                          order.isShipped ? "bg-blue-100 text-blue-800" :
                          order.isPaid ? "bg-indigo-100 text-indigo-800" : 
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.isDelivered ? "Livré" : 
                           order.isShipped ? "Expédié" :
                           order.isPaid ? "En traitement" : 
                           "En attente"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noOrders || "text-gray-500 italic"}>
                  Aucune commande
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.ordersTab || ""}>
            <h3 className={styles.sectionTitle || "text-lg font-medium text-gray-800 mb-4"}>Historique des commandes</h3>
            
            {orders.length > 0 ? (
              <div className={styles.ordersTable || "overflow-x-auto"}>
                <table className={styles.table || "min-w-full divide-y divide-gray-200"}>
                  <thead className={styles.tableHeader || "bg-gray-50"}>
                    <tr>
                      <th className={styles.tableHeaderCell || "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>ID</th>
                      <th className={styles.tableHeaderCell || "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>Date</th>
                      <th className={styles.tableHeaderCell || "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>Articles</th>
                      <th className={styles.tableHeaderCell || "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>Total</th>
                      <th className={styles.tableHeaderCell || "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>Statut</th>
                      <th className={styles.tableHeaderCell || "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody || "bg-white divide-y divide-gray-200"}>
                    {orders.map((order) => (
                      <tr key={order._id} className={styles.tableRow || "hover:bg-gray-50"}>
                        <td className={styles.tableCell || "px-6 py-4 whitespace-nowrap text-sm font-medium text-accent"}>
                          #{order._id.substr(-6)}
                        </td>
                        <td className={styles.tableCell || "px-6 py-4 whitespace-nowrap text-sm text-gray-500"}>
                          {formatDate(order.createdAt)}
                        </td>
                        <td className={styles.tableCell || "px-6 py-4 whitespace-nowrap text-sm text-gray-500"}>
                          {order.orderItems?.length || 0}
                        </td>
                        <td className={styles.tableCell || "px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"}>
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className={styles.tableCell || "px-6 py-4 whitespace-nowrap"}>
                          <span className={`${styles.statusBadge || "px-2 py-1 text-xs rounded-full"} ${
                            order.isDelivered ? "bg-green-100 text-green-800" : 
                            order.isShipped ? "bg-blue-100 text-blue-800" :
                            order.isPaid ? "bg-indigo-100 text-indigo-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.isDelivered ? "Livré" : 
                             order.isShipped ? "Expédié" :
                             order.isPaid ? "En traitement" : 
                             "En attente"}
                          </span>
                        </td>
                        <td className={styles.tableCell || "px-6 py-4 whitespace-nowrap text-sm font-medium"}>
                          <button
                            className={styles.viewButton || "text-accent hover:text-accent-dark mr-2"}
                            onClick={() => {/* Handle view */}}
                          >
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.noOrders || "text-gray-500 italic"}>
                Aucune commande trouvée
              </div>
            )}
          </div>
        )}

        {activeTab === 'interactions' && (
          <div className={styles.interactionsTab || ""}>
            <h3 className={styles.sectionTitle || "text-lg font-medium text-gray-800 mb-4"}>Interactions client</h3>
            
            {interactions && interactions.data && interactions.data.length > 0 ? (
              <div className={styles.interactionsList || "space-y-4"}>
                {interactions.data.map((interaction, index) => (
                  <div key={index} className={styles.interactionCard || "bg-gray-50 p-3 rounded-lg"}>
                    <div className={styles.interactionHeader || "flex justify-between items-center mb-2"}>
                      <span className={styles.interactionType || "text-sm font-medium"}>
                        {interaction.type === 'product_view' ? 'Vue produit' :
                        interaction.type === 'search' ? 'Recherche' :
                        interaction.type === 'cart_add' ? 'Ajout au panier' :
                        interaction.type === 'cart_remove' ? 'Retrait du panier' :
                        interaction.type === 'checkout_start' ? 'Début de commande' :
                        interaction.type === 'checkout_complete' ? 'Commande finalisée' :
                        interaction.type === 'support_contact' ? 'Contact support' :
                        'Interaction'}
                      </span>
                      <span className={styles.interactionDate || "text-xs text-gray-500"}>{formatDate(interaction.timestamp)}</span>
                    </div>
                    
                    <div className={styles.interactionDetails || "text-sm text-gray-700"}>
                      {interaction.type === 'product_view' && (
                        <div>
                          <p>Produit: <span className="font-medium">{interaction.details.productName}</span></p>
                          <p className="text-xs text-gray-500 mt-1">
                            Durée de visualisation: {interaction.details.duration} secondes
                          </p>
                        </div>
                      )}
                      
                      {interaction.type === 'search' && (
                        <div>
                          <p>Terme recherché: <span className="font-medium">"{interaction.details.query}"</span></p>
                          <p className="text-xs text-gray-500 mt-1">
                            {interaction.details.resultsCount} résultats trouvés
                          </p>
                        </div>
                      )}
                      
                      {interaction.type === 'cart_add' && (
                        <div>
                          <p>Produit ajouté: <span className="font-medium">{interaction.details.productName}</span></p>
                          <p className="text-xs text-gray-500 mt-1">
                            Quantité: {interaction.details.quantity}, Taille: {interaction.details.size}
                          </p>
                        </div>
                      )}
                      
                      {interaction.type === 'checkout_start' && (
                        <div>
                          <p>Commande initiée - {interaction.details.cartItems} articles</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total: {formatCurrency(interaction.details.cartTotal)}
                          </p>
                        </div>
                      )}
                      
                      {interaction.type === 'support_contact' && (
                        <div>
                          <p>Sujet: <span className="font-medium">{interaction.details.subject}</span></p>
                          <p className="text-xs text-gray-500 mt-1">
                            via {interaction.details.channel}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noInteractions || "text-gray-500 italic"}>
                Aucune interaction enregistrée
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInsights;