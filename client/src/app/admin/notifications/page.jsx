'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';

export default function AdminNotificationsPage() {
  const { showSuccess, showError } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all',
    targetUsers: []
  });
  const [users, setUsers] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch notifications and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notificationsResponse, usersResponse] = await Promise.all([
          adminService.getNotifications(),
          adminService.getUsers()
        ]);
        
        setNotifications(notificationsResponse.data || []);
        setUsers(usersResponse.data || []);
      } catch (error) {
        showError('Erreur lors du chargement des notifications', {
          title: 'Erreur de données'
        });
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [showError]);

  // Apply filters to notifications data
  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === 'all' || notification.type === filterType;
    const statusMatch = filterStatus === 'all' || notification.status === filterStatus;
    return typeMatch && statusMatch;
  });

  // Table columns definition
  const columns = [
    {
      id: 'date',
      header: 'Date',
      accessor: (notification) => notification.createdAt || 'N/A',
      sortable: true,
      cell: (notification) => {
        if (!notification.createdAt) return 'N/A';
        return new Date(notification.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      id: 'title',
      header: 'Titre',
      accessor: (notification) => notification.title || 'N/A',
      sortable: true
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (notification) => notification.type || 'info',
      sortable: true,
      cell: (notification) => {
        const typeLabels = {
          'info': 'Information',
          'success': 'Succès',
          'warning': 'Avertissement',
          'error': 'Erreur'
        };
        
        const typeStyles = {
          'info': 'bg-blue-100 text-blue-800',
          'success': 'bg-green-100 text-green-800',
          'warning': 'bg-yellow-100 text-yellow-800',
          'error': 'bg-red-100 text-red-800'
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            typeStyles[notification.type] || typeStyles.info
          }`}>
            {typeLabels[notification.type] || 'Information'}
          </span>
        );
      }
    },
    {
      id: 'target',
      header: 'Destinataires',
      accessor: (notification) => notification.target || 'all',
      sortable: true,
      cell: (notification) => {
        const targetLabels = {
          'all': 'Tous les utilisateurs',
          'admins': 'Administrateurs',
          'specific': 'Utilisateurs spécifiques'
        };
        
        return targetLabels[notification.target] || notification.target;
      }
    },
    {
      id: 'status',
      header: 'Statut',
      accessor: (notification) => notification.status || 'active',
      sortable: true,
      cell: (notification) => {
        const statusLabels = {
          'active': 'Active',
          'expired': 'Expirée',
          'dismissed': 'Masquée'
        };
        
        const statusStyles = {
          'active': 'bg-green-100 text-green-800',
          'expired': 'bg-gray-100 text-gray-800',
          'dismissed': 'bg-gray-100 text-gray-800'
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusStyles[notification.status] || statusStyles.active
          }`}>
            {statusLabels[notification.status] || 'Active'}
          </span>
        );
      }
    },
    {
      id: 'readCount',
      header: 'Lectures',
      accessor: (notification) => notification.readCount || 0,
      sortable: true,
      cell: (notification) => {
        const totalCount = notification.totalCount || 0;
        const readCount = notification.readCount || 0;
        const percentage = totalCount > 0 
          ? Math.round((readCount / totalCount) * 100) 
          : 0;
        
        return (
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-accent h-2.5 rounded-full" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: 'var(--color-accent)'
                }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{readCount}/{totalCount} ({percentage}%)</span>
          </div>
        );
      }
    }
  ];

  // Table actions
  const actions = [
    {
      name: 'Voir',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: (notification) => handleViewNotification(notification)
    },
    {
      name: 'Marquer comme expirée',
      className: notification => notification.status === 'active' ? 'text-accent hover:text-accent-dark' : 'text-gray-400 cursor-not-allowed',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: (notification) => handleExpireNotification(notification),
      isDisabled: (notification) => notification.status !== 'active'
    },
    {
      name: 'Supprimer',
      className: 'text-red-600 hover:text-red-800',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: (notification) => handleDeleteNotification(notification)
    }
  ];

  // Handle filter changes
  const handleTypeFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Modal handlers
  const handleViewNotification = (notification) => {
    setCurrentNotification(notification);
    setIsModalOpen(true);
  };

  const handleExpireNotification = async (notification) => {
    try {
      // The API call would typically update the notification status
      await adminService.updateNotification(notification._id, { status: 'expired' });
      showSuccess('Notification marquée comme expirée');
      
      // Refresh notifications
      const response = await adminService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      showError('Erreur lors de la mise à jour de la notification', {
        title: 'Erreur'
      });
      console.error('Error updating notification:', error);
    }
  };

  const handleDeleteNotification = async (notification) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      try {
        // The API call would typically delete the notification
        await adminService.deleteNotification(notification._id);
        showSuccess('Notification supprimée avec succès');
        
        // Refresh notifications
        const response = await adminService.getNotifications();
        setNotifications(response.data || []);
      } catch (error) {
        showError('Erreur lors de la suppression de la notification', {
          title: 'Erreur'
        });
        console.error('Error deleting notification:', error);
      }
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSelection = (userId) => {
    setFormData((prev) => {
      const targetUsers = [...prev.targetUsers];
      const index = targetUsers.indexOf(userId);
      
      if (index === -1) {
        // Add user if not already in the list
        targetUsers.push(userId);
      } else {
        // Remove user if already in the list
        targetUsers.splice(index, 1);
      }
      
      return { ...prev, targetUsers };
    });
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    
    try {
      // The API call would typically create a new notification
      await adminService.createNotification(formData);
      showSuccess('Notification créée avec succès');
      setIsCreateModalOpen(false);
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        type: 'info',
        target: 'all',
        targetUsers: []
      });
      
      // Refresh notifications
      const response = await adminService.getNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      showError('Erreur lors de la création de la notification', {
        title: 'Erreur'
      });
      console.error('Error creating notification:', error);
    }
  };

  // Render notification details
  const renderNotificationDetails = () => {
    if (!currentNotification) return null;
    
    const typeLabels = {
      'info': 'Information',
      'success': 'Succès',
      'warning': 'Avertissement',
      'error': 'Erreur'
    };
    
    const targetLabels = {
      'all': 'Tous les utilisateurs',
      'admins': 'Administrateurs',
      'specific': 'Utilisateurs spécifiques'
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{currentNotification.title}</h3>
            <p className="text-sm text-gray-500">
              Créée le {new Date(currentNotification.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            currentNotification.type === 'info' ? 'bg-blue-100 text-blue-800' :
            currentNotification.type === 'success' ? 'bg-green-100 text-green-800' :
            currentNotification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            currentNotification.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {typeLabels[currentNotification.type] || 'Information'}
          </span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Détails</h4>
          <p className="text-sm text-gray-900 mb-1">
            <span className="font-medium">Type:</span> {typeLabels[currentNotification.type] || 'Information'}
          </p>
          <p className="text-sm text-gray-900 mb-1">
            <span className="font-medium">Destinataires:</span> {targetLabels[currentNotification.target] || currentNotification.target}
          </p>
          <p className="text-sm text-gray-900 mb-1">
            <span className="font-medium">Statut:</span> {
              currentNotification.status === 'active' ? 'Active' :
              currentNotification.status === 'expired' ? 'Expirée' :
              currentNotification.status === 'dismissed' ? 'Masquée' :
              'Inconnu'
            }
          </p>
          <p className="text-sm text-gray-900">
            <span className="font-medium">Lectures:</span> {currentNotification.readCount || 0}/{currentNotification.totalCount || 0}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
          <div className="bg-white border border-gray-200 rounded-md p-4 whitespace-pre-wrap">
            {currentNotification.message || 'Aucun message'}
          </div>
        </div>
        
        {currentNotification.target === 'specific' && currentNotification.targetUsers && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Utilisateurs ciblés</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              {currentNotification.targetUsers.length > 0 ? (
                <ul className="space-y-1">
                  {currentNotification.targetUsers.map((userId) => {
                    const user = users.find(u => u._id === userId);
                    return (
                      <li key={userId} className="text-sm text-gray-900">
                        {user ? user.name : userId} {user ? `(${user.email})` : ''}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Aucun utilisateur spécifique sélectionné</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Gestion des notifications</h1>
            <p className="text-gray-500">Créez et gérez les notifications pour les utilisateurs</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <select
                className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-accent focus:border-accent"
                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                value={filterType}
                onChange={handleTypeFilterChange}
              >
                <option value="all">Tous les types</option>
                <option value="info">Information</option>
                <option value="success">Succès</option>
                <option value="warning">Avertissement</option>
                <option value="error">Erreur</option>
              </select>
              <select
                className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-accent focus:border-accent"
                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                value={filterStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Active</option>
                <option value="expired">Expirée</option>
                <option value="dismissed">Masquée</option>
              </select>
            </div>
            <button
              className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-md transition-colors duration-200"
              style={{ 
                backgroundColor: 'var(--color-accent)', 
                ':hover': { backgroundColor: 'var(--color-accent-dark)' } 
              }}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouvelle notification
              </div>
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredNotifications}
          actions={actions}
          isLoading={loading}
          emptyMessage="Aucune notification trouvée"
        />
      </div>

      {/* View Notification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Détails de la notification"
        size="large"
      >
        {renderNotificationDetails()}
      </Modal>

      {/* Create Notification Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer une notification"
        size="large"
        footer={
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Annuler
            </button>
            <button
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark"
              onClick={handleCreateNotification}
              style={{ 
                backgroundColor: 'var(--color-accent)', 
                ':hover': { backgroundColor: 'var(--color-accent-dark)' } 
              }}
            >
              Créer
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateNotification} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type de notification
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
            >
              <option value="info">Information</option>
              <option value="success">Succès</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="target" className="block text-sm font-medium text-gray-700">
              Destinataires
            </label>
            <select
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="admins">Administrateurs uniquement</option>
              <option value="specific">Utilisateurs spécifiques</option>
            </select>
          </div>
          
          {formData.target === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner des utilisateurs
              </label>
              <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                {users.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <li key={user._id} className="p-3 hover:bg-gray-50">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`user-${user._id}`}
                            checked={formData.targetUsers.includes(user._id)}
                            onChange={() => handleUserSelection(user._id)}
                            className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                            style={{ 
                              '--tw-ring-color': 'var(--color-accent)', 
                              'color': 'var(--color-accent)' 
                            }}
                          />
                          <label htmlFor={`user-${user._id}`} className="ml-3 text-sm text-gray-900">
                            <span className="font-medium">{user.name}</span> ({user.email})
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucun utilisateur disponible
                  </div>
                )}
              </div>
              {formData.targetUsers.length > 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  {formData.targetUsers.length} utilisateur(s) sélectionné(s)
                </p>
              )}
            </div>
          )}
        </form>
      </Modal>
    </AdminLayout>
  );
}