// src/components/admin/StatusUpdateForm.jsx
import React, { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import styles from './StatusUpdateForm.module.css';

const StatusUpdateForm = ({ order, onClose, onSuccess }) => {
  const [newStatus, setNewStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Get current order status to determine available next statuses
  useEffect(() => {
    // Pre-populate note field if it's a cancellation
    if (order.isCancelled && order.cancelReason) {
      setUpdateNote(order.cancelReason);
    }
  }, [order]);
  
  // Get status display helper
  const getStatusDisplay = (order) => {
    if (order.isCancelled) return { label: "Annulé", style: "bg-red-100 text-red-800" };
    if (order.isDelivered) return { label: "Livré", style: "bg-green-100 text-green-800" };
    if (order.isShipped) return { label: "Expédié", style: "bg-blue-100 text-blue-800" };
    if (order.isPaid) return { label: "En traitement", style: "bg-indigo-100 text-indigo-800" };
    return { label: "En attente", style: "bg-yellow-100 text-yellow-800" };
  };

  // Determine available next statuses
  const getAvailableStatuses = () => {
    const statuses = [];
    
    // Processing status (mark as paid and in processing)
    if (!order.isPaid && !order.isCancelled) {
      statuses.push({ value: 'processing', label: 'En traitement', disabled: false });
    }
    
    // Shipped status
    if ((order.isPaid || order.isProcessing) && !order.isShipped && !order.isDelivered && !order.isCancelled) {
      statuses.push({ value: 'shipped', label: 'Expédié', disabled: false });
    }
    
    // Delivered status
    if (order.isShipped && !order.isDelivered && !order.isCancelled) {
      statuses.push({ value: 'delivered', label: 'Livré', disabled: false });
    }
    
    // Cancelled status (always available unless already delivered)
    if (!order.isDelivered && !order.isCancelled) {
      statuses.push({ value: 'cancelled', label: 'Annulé', disabled: false });
    }
    
    // Add current status as disabled if not already covered
    const currentStatus = getCurrentStatus();
    if (!statuses.some(s => s.value === currentStatus)) {
      statuses.push({ 
        value: currentStatus, 
        label: getStatusLabel(currentStatus), 
        disabled: true,
        current: true
      });
    }
    
    return statuses;
  };
  
  const getCurrentStatus = () => {
    if (order.isCancelled) return 'cancelled';
    if (order.isDelivered) return 'delivered';
    if (order.isShipped) return 'shipped';
    if (order.isPaid || order.isProcessing) return 'processing';
    return 'pending';
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédié';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!newStatus) {
      newErrors.status = 'Veuillez sélectionner un statut';
    }
    
    if (newStatus === 'cancelled' && !updateNote.trim()) {
      newErrors.note = 'Une note est requise pour annuler une commande';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleStatusUpdate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Call the API to update order status
      await adminService.updateOrderStatus(order._id, {
        status: newStatus,
        note: updateNote
      });
      
      // Call the success handler
      if (onSuccess) {
        onSuccess(`Statut de la commande mis à jour avec succès vers "${getStatusLabel(newStatus)}"`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      if (onSuccess) {
        onSuccess(`Erreur lors de la mise à jour du statut: ${error.message || 'Erreur inconnue'}`, true);
      }
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleSelectStatus = (status) => {
    if (status.disabled) return;
    setNewStatus(status.value);
    setErrors({...errors, status: null});
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.currentStatusSection}>
        <div className={styles.sectionLabel}>Statut actuel:</div>
        <div className={`${styles.statusBadge} ${getStatusDisplay(order).style}`}>
          {getStatusDisplay(order).label}
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <div className={styles.formLabel}>Nouveau statut:</div>
        
        {/* Visual status options */}
        <div className={styles.statusOptions}>
          {getAvailableStatuses().map((status) => (
            <div 
              key={status.value}
              className={`${styles.statusOption} ${styles[status.value]} ${
                newStatus === status.value ? styles.selected : ''
              } ${status.disabled ? styles.disabled : ''}`}
              onClick={() => !status.disabled && handleSelectStatus(status)}
              title={status.disabled ? 'Statut actuel' : `Définir comme ${status.label}`}
            >
              {status.label}
              {status.current && ' (actuel)'}
            </div>
          ))}
        </div>
        
        {errors.status && (
          <div className="text-red-500 text-sm mt-1">{errors.status}</div>
        )}
        
        {/* Alternative select for accessibility */}
        <div className="sr-only">
          <select 
            className={styles.selectInput}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            aria-label="Sélectionner un statut"
          >
            <option value="">Sélectionner un statut</option>
            {getAvailableStatuses().map((status) => (
              <option 
                key={status.value} 
                value={status.value}
                disabled={status.disabled}
              >
                {status.label}{status.current ? ' (actuel)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Note d'administration {newStatus === 'cancelled' ? '(obligatoire)' : '(recommandée)'}:
        </label>
        <textarea 
          className={styles.textareaInput}
          value={updateNote}
          onChange={(e) => {
            setUpdateNote(e.target.value);
            if (newStatus === 'cancelled' && e.target.value.trim()) {
              setErrors({...errors, note: null});
            }
          }}
          placeholder={
            newStatus === 'cancelled' 
              ? "Veuillez indiquer la raison de l'annulation..." 
              : "Ajouter une note concernant cette mise à jour (visible dans l'historique)..."
          }
        ></textarea>
        <div className="text-xs text-gray-500 mt-1">
          Cette note sera visible dans l'historique de la commande pour tous les administrateurs.
        </div>
        {errors.note && (
          <div className="text-red-500 text-sm mt-1">{errors.note}</div>
        )}
      </div>
      
      {/* Status change preview */}
      {newStatus && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium mb-2">Aperçu de la mise à jour:</div>
          <div className="flex items-center text-sm">
            <div className={`${styles.statusBadge} ${getStatusDisplay(order).style} mr-2`}>
              {getStatusDisplay(order).label}
            </div>
            <span className="mx-2">→</span>
            <div className={`${styles.statusBadge} ${
              newStatus === 'processing' ? 'bg-indigo-100 text-indigo-800' :
              newStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
              newStatus === 'delivered' ? 'bg-green-100 text-green-800' :
              newStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getStatusLabel(newStatus)}
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.actionBar}>
        <button 
          className={styles.cancelButton}
          onClick={onClose}
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button 
          className={styles.updateButton}
          onClick={handleStatusUpdate}
          disabled={!newStatus || isSubmitting || (newStatus === 'cancelled' && !updateNote.trim())}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Mise à jour...</span>
              <div className={styles.loadingSpinner}></div>
            </>
          ) : 'Mettre à jour'}
        </button>
      </div>
    </div>
  );
};

export default StatusUpdateForm;