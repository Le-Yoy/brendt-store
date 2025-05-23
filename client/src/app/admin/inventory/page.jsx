'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';

export default function AdminInventoryPage() {
  const { showSuccess, showError } = useNotification();
  const searchParams = useSearchParams();
  const productFilter = searchParams.get('product');
  
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'view', 'approve', 'reject'
  const [formData, setFormData] = useState({
    productId: '',
    newQuantity: 0,
    action: 'add',
    reason: '',
    status: 'pending'
  });
  const [commentText, setCommentText] = useState('');

  // Fetch inventory logs and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [logsResponse, productsResponse] = await Promise.all([
          adminService.getInventoryLogs(),
          adminService.getProducts()
        ]);
        
        let logs = logsResponse.data || [];
        
        // Apply product filter if present
        if (productFilter) {
          logs = logs.filter(log => log.productId === productFilter);
        }
        
        setInventoryLogs(logs);
        setProducts(productsResponse.data || []);
      } catch (error) {
        showError('Erreur lors du chargement des données d\'inventaire', {
          title: 'Erreur de données'
        });
        console.error('Error fetching inventory data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [showError, productFilter]);

  // Get product name by ID
  const getProductName = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.name : 'Produit inconnu';
  };

  // Table columns definition
  const columns = [
    {
      id: 'date',
      header: 'Date',
      accessor: (log) => log.createdAt || 'N/A',
      sortable: true,
      cell: (log) => {
        if (!log.createdAt) return 'N/A';
        return new Date(log.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      id: 'product',
      header: 'Produit',
      accessor: (log) => getProductName(log.productId),
      sortable: true
    },
    {
      id: 'action',
      header: 'Action',
      accessor: (log) => log.action || 'N/A',
      sortable: true,
      cell: (log) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          log.action === 'add' 
            ? 'bg-green-100 text-green-800' 
            : log.action === 'remove'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
        }`}>
          {log.action === 'add' ? 'Ajout' : log.action === 'remove' ? 'Retrait' : 'Ajustement'}
        </span>
      )
    },
    {
      id: 'quantity',
      header: 'Quantité',
      accessor: (log) => log.newQuantity || 0,
      sortable: true,
      cell: (log) => {
        const prefix = log.action === 'add' ? '+' : log.action === 'remove' ? '-' : '';
        return <span className="font-medium">{prefix}{log.newQuantity}</span>;
      }
    },
    {
      id: 'reason',
      header: 'Raison',
      accessor: (log) => log.reason || 'N/A',
      sortable: true,
      cell: (log) => (
        <div className="max-w-xs truncate" title={log.reason}>
          {log.reason || 'N/A'}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Statut',
      accessor: (log) => log.status || 'pending',
      sortable: true,
      cell: (log) => {
        const statusStyles = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800'
        };
        
        const statusLabels = {
          pending: 'En attente',
          approved: 'Approuvé',
          rejected: 'Rejeté'
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusStyles[log.status] || statusStyles.pending
          }`}>
            {statusLabels[log.status] || 'En attente'}
          </span>
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
      onClick: (log) => handleViewLog(log)
    },
    {
      name: 'Approuver',
      className: 'text-green-600 hover:text-green-800',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      onClick: (log) => handleApproveLog(log),
      isDisabled: (log) => log.status !== 'pending'
    },
    {
      name: 'Rejeter',
      className: 'text-red-600 hover:text-red-800',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      onClick: (log) => handleRejectLog(log),
      isDisabled: (log) => log.status !== 'pending'
    }
  ];

  // Modal handlers
  const handleAddInventoryLog = () => {
    setModalMode('create');
    setFormData({
      productId: '',
      newQuantity: 0,
      action: 'add',
      reason: '',
      status: 'pending'
    });
    setIsModalOpen(true);
  };

  const handleViewLog = (log) => {
    setModalMode('view');
    setCurrentLog(log);
    setIsModalOpen(true);
  };

  const handleApproveLog = (log) => {
    setModalMode('approve');
    setCurrentLog(log);
    setCommentText('');
    setIsModalOpen(true);
  };

  const handleRejectLog = (log) => {
    setModalMode('reject');
    setCurrentLog(log);
    setCommentText('');
    setIsModalOpen(true);
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create new inventory log
      await adminService.createInventoryLog({
        ...formData,
        requestedBy: 'admin' // This would normally be the user ID
      });
      
      showSuccess('Demande d\'inventaire créée avec succès');
      setIsModalOpen(false);
      
      // Refresh the list
      const logsResponse = await adminService.getInventoryLogs();
      setInventoryLogs(logsResponse.data || []);
    } catch (error) {
      showError('Erreur lors de la création de la demande d\'inventaire', {
        title: 'Erreur'
      });
      console.error('Error creating inventory log:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await adminService.approveInventoryLog(currentLog._id, commentText);
      showSuccess('Demande d\'inventaire approuvée avec succès');
      setIsModalOpen(false);
      
      // Refresh the list
      const logsResponse = await adminService.getInventoryLogs();
      setInventoryLogs(logsResponse.data || []);
    } catch (error) {
      showError('Erreur lors de l\'approbation de la demande d\'inventaire', {
        title: 'Erreur'
      });
      console.error('Error approving inventory log:', error);
    }
  };

  const handleReject = async () => {
    try {
      await adminService.rejectInventoryLog(currentLog._id, commentText);
      showSuccess('Demande d\'inventaire rejetée');
      setIsModalOpen(false);
      
      // Refresh the list
      const logsResponse = await adminService.getInventoryLogs();
      setInventoryLogs(logsResponse.data || []);
    } catch (error) {
      showError('Erreur lors du rejet de la demande d\'inventaire', {
        title: 'Erreur'
      });
      console.error('Error rejecting inventory log:', error);
    }
  };

  // Render log details for view mode
  const renderLogDetails = () => {
    if (!currentLog) return null;
    
    const statusLabels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    
    const actionLabels = {
      add: 'Ajout',
      remove: 'Retrait',
      adjust: 'Ajustement'
    };
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Produit</h3>
            <p className="mt-1 text-base font-medium text-gray-900">{getProductName(currentLog.productId)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date de demande</h3>
            <p className="mt-1 text-base text-gray-900">
              {currentLog.createdAt 
                ? new Date(currentLog.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'N/A'
              }
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Action</h3>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentLog.action === 'add' 
                  ? 'bg-green-100 text-green-800' 
                  : currentLog.action === 'remove'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {actionLabels[currentLog.action] || 'Inconnu'}
              </span>
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Quantité</h3>
            <p className="mt-1 text-base font-medium text-gray-900">
              {currentLog.action === 'add' ? '+' : currentLog.action === 'remove' ? '-' : ''}
              {currentLog.newQuantity}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Statut</h3>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentLog.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : currentLog.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {statusLabels[currentLog.status] || 'Inconnu'}
              </span>
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Demandeur</h3>
            <p className="mt-1 text-base text-gray-900">
              {currentLog.requestedBy || 'Inconnu'}
            </p>
          </div>
          
          <div className="sm:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Raison</h3>
            <p className="mt-1 text-base text-gray-900">
              {currentLog.reason || 'Aucune raison fournie'}
            </p>
          </div>
          
          {(currentLog.status === 'approved' || currentLog.status === 'rejected') && (
            <>
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Commentaire</h3>
                <p className="mt-1 text-base text-gray-900">
                  {currentLog.comment || 'Aucun commentaire'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Traité par</h3>
                <p className="mt-1 text-base text-gray-900">
                  {currentLog.processedBy || 'Inconnu'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date de traitement</h3>
                <p className="mt-1 text-base text-gray-900">
                  {currentLog.processedAt 
                    ? new Date(currentLog.processedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'
                  }
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Gestion de l'inventaire</h1>
            <p className="text-gray-500">
              {productFilter 
                ? `Affichage des journaux d'inventaire pour le produit sélectionné` 
                : `Gérez l'inventaire et les demandes de modification de stock`
              }
            </p>
          </div>
          <div className="flex space-x-2">
            {productFilter && (
              <a
                href="/admin/inventory"
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Tous les produits
                </div>
              </a>
            )}
            <button
              className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-md transition-colors duration-200"
              style={{ 
                backgroundColor: 'var(--color-accent)', 
                ':hover': { backgroundColor: 'var(--color-accent-dark)' } 
              }}
              onClick={handleAddInventoryLog}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouvelle demande d'inventaire
              </div>
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={inventoryLogs}
          actions={actions}
          isLoading={loading}
          emptyMessage="Aucun journal d'inventaire trouvé"
        />
      </div>

      {/* Inventory Log Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create' 
            ? 'Nouvelle demande d\'inventaire' 
            : modalMode === 'view'
              ? 'Détails de la demande d\'inventaire'
              : modalMode === 'approve'
                ? 'Approuver la demande d\'inventaire'
                : 'Rejeter la demande d\'inventaire'
        }
        footer={
          modalMode === 'create' ? (
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark"
                onClick={handleSubmit}
                style={{ 
                  backgroundColor: 'var(--color-accent)', 
                  ':hover': { backgroundColor: 'var(--color-accent-dark)' } 
                }}
              >
                Soumettre
              </button>
            </div>
          ) : modalMode === 'approve' ? (
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleApprove}
              >
                Approuver
              </button>
            </div>
          ) : modalMode === 'reject' ? (
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleReject}
              >
                Rejeter
              </button>
            </div>
          ) : null
        }
      >
        {modalMode === 'view' ? (
          renderLogDetails()
        ) : modalMode === 'create' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                Produit
              </label>
              <select
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                required
              >
                <option value="">Sélectionner un produit</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                Action
              </label>
              <select
                id="action"
                name="action"
                value={formData.action}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                required
              >
                <option value="add">Ajout de stock</option>
                <option value="remove">Retrait de stock</option>
                <option value="adjust">Ajustement de stock</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="newQuantity" className="block text-sm font-medium text-gray-700">
                Quantité
              </label>
              <input
                type="number"
                id="newQuantity"
                name="newQuantity"
                value={formData.newQuantity}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Raison
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                required
              />
            </div>
          </form>
        ) : (modalMode === 'approve' || modalMode === 'reject') ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 mb-4">
                {modalMode === 'approve'
                  ? `Vous êtes sur le point d'approuver une demande d'${currentLog?.action === 'add' ? 'ajout' : currentLog?.action === 'remove' ? 'retrait' : 'ajustement'} de ${currentLog?.newQuantity} unités de ${getProductName(currentLog?.productId)}.`
                  : `Vous êtes sur le point de rejeter une demande d'${currentLog?.action === 'add' ? 'ajout' : currentLog?.action === 'remove' ? 'retrait' : 'ajustement'} de ${currentLog?.newQuantity} unités de ${getProductName(currentLog?.productId)}.`
                }
              </p>
              
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire (optionnel)
              </label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                style={{ '--tw-ring-color': 'var(--color-accent)' }}
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </AdminLayout>
  );
}