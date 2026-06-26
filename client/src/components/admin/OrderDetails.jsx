// src/components/admin/OrderDetails.jsx
import React, { useState } from 'react';
import { formatByCurrency } from '@/utils/currency';

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

  // All amounts on an order are in the order's own currency (MAD/EUR/USD).
  const formatPrice = (price) => formatByCurrency(price, order?.currency || 'MAD') || '0,00 MAD';

  // Map an order to a label + monochrome badge variant.
  const getStatusDisplay = (order) => {
    if (order.isCancelled) return { label: "Annulé", cls: "adm-badge--danger" };
    if (order.isDelivered) return { label: "Livré", cls: "adm-badge--ok" };
    if (order.isShipped) return { label: "Expédié", cls: "adm-badge--muted" };
    if (order.isPaid) return { label: "En traitement", cls: "adm-badge--warn" };
    return { label: "En attente", cls: "adm-badge--warn" };
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

  // Reusable inline styles
  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '.4rem 0',
    borderBottom: '1px solid var(--adm-border)',
    fontSize: '.88rem'
  };
  const infoLabelStyle = { color: 'var(--adm-text-muted)', whiteSpace: 'nowrap' };
  const sectionTitleStyle = {
    fontSize: '.95rem',
    fontWeight: 600,
    color: 'var(--adm-text)',
    margin: '0 0 .65rem'
  };
  const tabStyle = (active) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '.6rem .9rem',
    fontSize: '.88rem',
    fontWeight: active ? 600 : 500,
    color: active ? 'var(--adm-text)' : 'var(--adm-text-muted)',
    borderBottom: active ? '2px solid var(--adm-ink)' : '2px solid transparent',
    display: 'inline-flex',
    alignItems: 'center'
  });

  // Tab contents
  const renderDetailsTab = () => (
    <div className="adm-stack" style={{ gap: '1.5rem' }}>
      {/* Order summary section */}
      <div className="adm-grid-2">
        <div>
          <h3 style={sectionTitleStyle}>Informations de commande</h3>
          <div className="adm-card adm-card-pad">
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Numéro de commande:</span>
              <span className="adm-cell-strong">#{order.orderNumber || order._id.substr(-6)}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>ID Système:</span>
              <span style={{ fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>{order._id}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Statut:</span>
              <span className={`adm-badge ${getStatusDisplay(order).cls}`}>
                {getStatusDisplay(order).label}
              </span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Paiement:</span>
              <span>{order.isPaid ?
                `Payé le ${formatDate(order.paidAt)}` :
                'En attente de paiement'}</span>
            </div>
            <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
              <span style={infoLabelStyle}>Méthode:</span>
              <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 style={sectionTitleStyle}>Client</h3>
          <div className="adm-card adm-card-pad">
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Nom:</span>
              <span>{order.user?.name || 'N/A'}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Email:</span>
              <span>{order.user?.email || 'N/A'}</span>
            </div>
            <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
              <span style={infoLabelStyle}>Téléphone:</span>
              <span>{order.shippingAddress?.phoneNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div>
        <h3 style={sectionTitleStyle}>Adresse de livraison</h3>
        <div className="adm-card adm-card-pad">
          <p style={{ fontWeight: 600, margin: '0 0 .35rem' }}>{order.shippingAddress?.fullName}</p>
          <p style={{ margin: '.15rem 0', color: 'var(--adm-text-muted)' }}>{order.shippingAddress?.address}</p>
          <p style={{ margin: '.15rem 0', color: 'var(--adm-text-muted)' }}>
            {order.shippingAddress?.city}
            {order.shippingAddress?.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}
          </p>
          <p style={{ margin: '.15rem 0', color: 'var(--adm-text-muted)' }}>{order.shippingAddress?.country}</p>
          <p style={{ margin: '.15rem 0', color: 'var(--adm-text-muted)' }}>{order.shippingAddress?.phoneNumber}</p>
        </div>
      </div>

      {/* Order summary */}
      <div>
        <h3 style={sectionTitleStyle}>Récapitulatif</h3>
        <div className="adm-card adm-card-pad">
          <div style={{ ...infoRowStyle }}>
            <span style={infoLabelStyle}>Sous-total:</span>
            <span>{formatPrice(order.totalPrice - (order.shippingPrice || 0))}</span>
          </div>
          <div style={{ ...infoRowStyle }}>
            <span style={infoLabelStyle}>Frais de livraison:</span>
            <span>{formatPrice(order.shippingPrice || 0)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '.65rem',
            fontWeight: 700,
            fontSize: '1rem'
          }}>
            <span>Total:</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItemsTab = () => (
    <div>
      <h3 style={sectionTitleStyle}>Articles commandés</h3>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Taille</th>
              <th>Couleur</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="adm-cell-strong">{item.name}</div>
                  <div className="adm-cell-muted" style={{ fontSize: '.78rem' }}>ID: {item.product}</div>
                </td>
                <td className="adm-cell-muted">{item.size}</td>
                <td>
                  <div className="adm-row" style={{ gap: '.4rem' }}>
                    <span
                      className="adm-swatch"
                      style={{
                        backgroundColor: item.colorCode || '#ccc',
                        border: item.colorCode?.toLowerCase() === '#ffffff' ? '1px solid var(--adm-border)' : 'none'
                      }}
                    />
                    {item.color}
                  </div>
                </td>
                <td className="adm-cell-muted">{formatPrice(item.price)}</td>
                <td className="adm-cell-muted">{item.quantity}</td>
                <td className="adm-cell-strong">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHistoryTab = () => {
    const timelineEvents = getTimelineEvents();

    return (
      <div>
        <h3 style={sectionTitleStyle}>Historique de la commande</h3>
        {timelineEvents.length === 0 ? (
          <div className="adm-empty">Aucun historique disponible</div>
        ) : (
          <div className="adm-stack" style={{ gap: '1rem' }}>
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--adm-border)'
                }}
              >
                <div style={{ minWidth: 170, fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>
                  {formatDate(event.date)}
                </div>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '.9rem' }}>{event.label}</span>
                  {event.description && (
                    <div style={{ color: 'var(--adm-text-muted)', marginTop: '.25rem', fontSize: '.85rem' }}>
                      {event.description}

                      {/* Show note indication */}
                      {event.isNote && (
                        <div style={{ marginTop: '.25rem', fontStyle: 'italic', fontSize: '.75rem', color: 'var(--adm-text-faint)' }}>
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
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--adm-border)' }}>
            <h4 style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--adm-text)', margin: '0 0 .5rem' }}>
              Notes d'administration ({order.adminNotes.length})
            </h4>
            <div style={{ background: 'var(--adm-surface-2)', padding: '.75rem', borderRadius: 'var(--adm-radius-sm)' }}>
              <p style={{ fontSize: '.85rem', color: 'var(--adm-text-muted)', margin: 0 }}>
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
    <div>
      {/* Tabs navigation */}
      <div className="adm-row adm-mb-lg" style={{ gap: 0, borderBottom: '1px solid var(--adm-border)' }}>
        <button style={tabStyle(activeTab === 'details')} onClick={() => setActiveTab('details')}>
          Détails
        </button>
        <button style={tabStyle(activeTab === 'items')} onClick={() => setActiveTab('items')}>
          Articles ({order.orderItems?.length || 0})
        </button>
        <button style={tabStyle(activeTab === 'history')} onClick={() => setActiveTab('history')}>
          Historique
          {(order.adminNotes && order.adminNotes.length > 0) && (
            <span
              style={{
                marginLeft: '.4rem',
                background: 'var(--adm-ink)',
                color: '#fff',
                fontSize: '.7rem',
                borderRadius: '999px',
                width: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
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
      <div className="adm-row" style={{ justifyContent: 'flex-end', gap: '.6rem', marginTop: '1.5rem' }}>
        <button className="adm-btn adm-btn--ghost" onClick={onClose}>
          Fermer
        </button>
        <button className="adm-btn adm-btn--primary" onClick={onStatusUpdate}>
          Modifier le statut
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
