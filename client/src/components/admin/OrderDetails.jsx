// src/components/admin/OrderDetails.jsx
import React, { useState } from 'react';
import styles from './OrderDetails.module.css';

const OrderDetails = ({ order, onClose, onStatusUpdate }) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'items', 'history'
  
  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Generate timeline events including admin notes
  const getTimelineEvents = () => {
    const events = [];
    
    // Add status history events if available
    if (order.statusHistory && order.statusHistory.length > 0) {
      order.statusHistory.forEach(history => {
        events.push({
          type: 'status',
          label: getStatusLabel(history.status),
          date: history.timestamp,
          description: history.note || getStatusDescription(history.status),
          updatedBy: history.updatedBy || 'Système',
          isNote: !!history.note
        });
      });
    } else {
      // Fallback to basic status events
      // Creation event
      events.push({
        type: 'status',
        label: 'Commande créée',
        date: order.createdAt,
        description: 'La commande a été passée par le client'
      });

      // Payment event
      if (order.isPaid) {
        events.push({
          type: 'status',
          label: 'Paiement confirmé',
          date: order.paidAt,
          description: 'Le paiement a été reçu et confirmé'
        });
      }

      // Processing event
      if (order.isProcessing) {
        events.push({
          type: 'status',
          label: 'En traitement',
          date: order.processingAt,
          description: 'La commande est en cours de préparation'
        });
      }

      // Shipped event
      if (order.isShipped) {
        events.push({
          type: 'status',
          label: 'Expédiée',
          date: order.shippedAt,
          description: 'La commande a été expédiée'
        });
      }

      // Delivered event
      if (order.isDelivered) {
        events.push({
          type: 'status',
          label: 'Livrée',
          date: order.deliveredAt,
          description: 'La commande a été livrée au client'
        });
      }

      // Cancelled event
      if (order.isCancelled) {
        events.push({
          type: 'status',
          label: 'Annulée',
          date: order.cancelledAt,
          description: order.cancelReason || 'La commande a été annulée'
        });
      }
    }
    
    // Add admin notes if available
    if (order.adminNotes && order.adminNotes.length > 0) {
      order.adminNotes.forEach(note => {
        events.push({
          type: 'note',
          label: 'Note d\'administrateur',
          date: note.addedAt,
          description: note.text,
          updatedBy: note.addedBy,
          isNote: true
        });
      });
    }

    // Sort by date
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pending': return 'La commande a été créée';
      case 'processing': return 'La commande est en cours de préparation';
      case 'shipped': return 'La commande a été expédiée';
      case 'delivered': return 'La commande a été livrée au client';
      case 'cancelled': return 'La commande a été annulée';
      default: return '';
    }
  };

  // Tab contents
  const renderDetailsTab = () => (
    <div className={styles.section}>
      {/* Order summary section */}
      <div className={styles.flexRow}>
        <div className={styles.column}>
          <h3 className={styles.sectionTitle}>Informations de commande</h3>
          <div className={styles.infoCard}>
          <div className={styles.infoRow}>
  <span className={styles.infoLabel}>Numéro de commande:</span>
  <span className={styles.infoValue}>#{order.orderNumber || order._id.substr(-6)}</span>
</div>
<div className={styles.infoRow}>
  <span className={styles.infoLabel}>ID Système:</span>
  <span className={styles.infoValue}>{order._id}</span>
</div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Statut:</span>
              <span className={`${styles.statusBadge} ${getStatusDisplay(order).style}`}>
                {getStatusDisplay(order).label}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Paiement:</span>
              <span>{order.isPaid ? 
                `Payé le ${formatDate(order.paidAt)}` : 
                'En attente de paiement'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Méthode:</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.column}>
          <h3 className={styles.sectionTitle}>Client</h3>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Nom:</span>
              <span>{order.user?.name || 'N/A'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span>{order.user?.email || 'N/A'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Téléphone:</span>
              <span>{order.shippingAddress?.phoneNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shipping address */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Adresse de livraison</h3>
        <div className={styles.addressCard}>
          <p className={styles.addressName}>{order.shippingAddress?.fullName}</p>
          <p className={styles.addressLine}>{order.shippingAddress?.address}</p>
          <p className={styles.addressLine}>
            {order.shippingAddress?.city}
            {order.shippingAddress?.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}
          </p>
          <p className={styles.addressLine}>{order.shippingAddress?.country}</p>
          <p className={styles.addressLine}>{order.shippingAddress?.phoneNumber}</p>
        </div>
      </div>
      
      {/* Order summary */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Récapitulatif</h3>
        <div className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Sous-total:</span>
            <span>{formatPrice(order.totalPrice - (order.shippingPrice || 0))}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Frais de livraison:</span>
            <span>{formatPrice(order.shippingPrice || 0)}</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total:</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItemsTab = () => (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Articles commandés</h3>
      <div className={styles.tableContainer}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Produit</th>
                <th className={styles.tableHeaderCell}>Taille</th>
                <th className={styles.tableHeaderCell}>Couleur</th>
                <th className={styles.tableHeaderCell}>Prix</th>
                <th className={styles.tableHeaderCell}>Quantité</th>
                <th className={styles.tableHeaderCell}>Total</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {order.orderItems?.map((item, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.productCell}>
                      <div className={styles.productImage}>
                        {/* Placeholder for product image */}
                      </div>
                      <div className={styles.productInfo}>
                        <div className={styles.productName}>{item.name}</div>
                        <div className={styles.productId}>ID: {item.product}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableCell}>{item.size}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.colorDisplay}>
                      <span 
                        className={styles.colorSwatch} 
                        style={{ 
                          backgroundColor: item.colorCode || '#ccc',
                          border: item.colorCode?.toLowerCase() === '#ffffff' ? '1px solid #ddd' : 'none'
                        }}
                      ></span>
                      {item.color}
                    </div>
                  </td>
                  <td className={styles.tableCell}>{formatPrice(item.price)}</td>
                  <td className={styles.tableCell}>{item.quantity}</td>
                  <td className={styles.tableCell + ' font-medium'}>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => {
    const timelineEvents = getTimelineEvents();
    
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Historique de la commande</h3>
        {timelineEvents.length === 0 ? (
          <div className="text-gray-500 text-center py-6">Aucun historique disponible</div>
        ) : (
          <div className={styles.timeline}>
            {timelineEvents.map((event, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineDate}>{formatDate(event.date)}</div>
                <div className={styles.timelineContent}>
                  <span className="font-medium">{event.label}</span>
                  {event.description && (
                    <div className="text-gray-600 mt-1">
                      {event.description}
                      
                      {/* Show note indication */}
                      {event.isNote && (
                        <div className="mt-1 italic text-xs text-gray-500">
                          Note ajoutée par: {typeof event.updatedBy === 'object' ? event.updatedBy.name || 'Admin' : 'Admin'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Show notes count badge on the tab title */}
        {(order.adminNotes && order.adminNotes.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Notes d'administration ({order.adminNotes.length})</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">
                Les notes d'administration sont visibles dans la chronologie ci-dessus,
                marquées comme "Note d'administrateur".
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Tabs navigation */}
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'details' 
            ? 'text-accent border-b-2 border-accent' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('details')}
        >
          Détails
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'items' 
            ? 'text-accent border-b-2 border-accent' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('items')}
        >
          Articles ({order.orderItems?.length || 0})
        </button>
        <button 
          className={`px-4 py-2 font-medium flex items-center ${activeTab === 'history' 
            ? 'text-accent border-b-2 border-accent' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('history')}
        >
          Historique
          {(order.adminNotes && order.adminNotes.length > 0) && (
            <span className="ml-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {order.adminNotes.length}
            </span>
          )}
        </button>
      </div>
      
      {/* Active tab content */}
      {activeTab === 'details' && renderDetailsTab()}
      {activeTab === 'items' && renderItemsTab()}
      {activeTab === 'history' && renderHistoryTab()}
      
      {/* Action buttons */}
      <div className={styles.actionBar}>
        <button 
          className={styles.closeButton}
          onClick={onClose}
        >
          Fermer
        </button>
        <button 
          className={styles.updateButton}
          onClick={onStatusUpdate}
        >
          Modifier le statut
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;