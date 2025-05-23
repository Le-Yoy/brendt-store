'use client';

import React, { useState, useEffect } from 'react';
import styles from './OrderTimeline.module.css';
import adminService from '@/services/adminService';
import { useNotification } from '@/contexts/NotificationContext';

const OrderTimeline = ({ orderId }) => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    const fetchOrderTimeline = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        // Try to fetch the real timeline events
        const response = await adminService.getOrderTimeline(orderId);
        setTimelineEvents(response.data || []);
      } catch (error) {
        console.error('Error fetching order timeline:', error);
        // If API fails, generate a minimal timeline from order data
        try {
          const orderDetails = await adminService.getOrderWithDetails(orderId);
          const order = orderDetails.data;
          
          if (order) {
            const events = [];
            
            // Add creation event
            events.push({
              type: 'order_created',
              title: 'Commande créée',
              description: 'La commande a été passée par le client',
              timestamp: order.createdAt,
              status: 'complete'
            });
            
            // Add payment event if paid
            if (order.isPaid) {
              events.push({
                type: 'payment_confirmed',
                title: 'Paiement confirmé',
                description: 'Le paiement a été reçu et confirmé',
                timestamp: order.paidAt,
                status: 'complete'
              });
            }
            
            // Add shipping event if shipped
            if (order.isShipped) {
              events.push({
                type: 'order_shipped',
                title: 'Commande expédiée',
                description: 'La commande a été remise au transporteur',
                timestamp: order.shippedAt,
                status: 'complete'
              });
            }
            
            // Add delivery event if delivered
            if (order.isDelivered) {
              events.push({
                type: 'order_delivered',
                title: 'Commande livrée',
                description: 'La commande a été livrée au client',
                timestamp: order.deliveredAt,
                status: 'complete'
              });
            }
            
            // Sort events by timestamp
            events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            setTimelineEvents(events);
          }
        } catch (fallbackError) {
          console.error('Error generating fallback timeline:', fallbackError);
          showError('Impossible de récupérer l\'historique de la commande');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderTimeline();
  }, [orderId, showError]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determine event icon based on type
  const getEventIcon = (type) => {
    switch (type) {
      case 'order_created':
        return (
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2H2v10h10V2zM12 12H2v10h10V12zM22 2h-10v10h10V2zM22 12h-10v10h10V12z"></path>
            </svg>
          </div>
        );
      case 'payment_confirmed':
        return (
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        );
      case 'order_processing':
        return (
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
        );
      case 'order_packed':
        return (
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v3" />
              <path d="M21 16v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3" />
              <rect x="2" y="8" width="20" height="8" rx="1" />
            </svg>
          </div>
        );
      case 'order_shipped':
        return (
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 22h8" />
              <path d="M3.8 17h16.4" />
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
        );
      case 'order_delivered':
        return (
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        );
      case 'order_cancelled':
        return (
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (!timelineEvents || timelineEvents.length === 0) {
    return (
      <div className={styles.emptyTimeline}>
        <p>Aucun événement trouvé pour cette commande</p>
      </div>
    );
  }

  return (
    <div className={styles.timelineContainer}>
      <h3 className={styles.timelineTitle}>Chronologie de la commande</h3>
      
      <div className={styles.timeline}>
        {timelineEvents.map((event, index) => (
          <div 
            key={index} 
            className={`${styles.timelineItem} ${
              event.status === 'pending' ? styles.pending :
              event.status === 'in-progress' ? styles.inProgress :
              styles.complete
            }`}
          >
            {getEventIcon(event.type)}
            
            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <h4 className={styles.eventTitle}>{event.title}</h4>
                <span className={styles.eventDate}>{formatDate(event.timestamp)}</span>
              </div>
              
              {event.description && (
                <p className={styles.eventDescription}>{event.description}</p>
              )}
              
              {event.details && (
                <div className={styles.eventDetails}>
                  {typeof event.details === 'string' ? (
                    <p>{event.details}</p>
                  ) : (
                    <ul className={styles.detailsList}>
                      {Object.entries(event.details).map(([key, value], i) => (
                        <li key={i}>
                          <span className={styles.detailLabel}>{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;