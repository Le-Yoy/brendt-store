'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';

export default function AdminFormsPage() {
  const { showSuccess, showError } = useNotification();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'respond'
  const [responseText, setResponseText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch forms on component mount
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await adminService.getForms();
      setForms(response.data || []);
    } catch (error) {
      showError('Erreur lors du chargement des formulaires', {
        title: 'Erreur de données'
      });
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to forms data
  const filteredForms = forms.filter(form => {
    const typeMatch = filterType === 'all' || form.type === filterType;
    const statusMatch = filterStatus === 'all' || form.status === filterStatus;
    return typeMatch && statusMatch;
  });

  // Table columns definition
  const columns = [
    {
      id: 'date',
      header: 'Date',
      accessor: (form) => form.createdAt || 'N/A',
      sortable: true,
      cell: (form) => {
        if (!form.createdAt) return 'N/A';
        return new Date(form.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
    {
      id: 'name',
      header: 'Nom',
      accessor: (form) => form.name || 'N/A',
      sortable: true
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (form) => form.email || 'N/A',
      sortable: true
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (form) => form.type || 'contact',
      sortable: true,
      cell: (form) => {
        const typeLabels = {
          'contact': 'Contact',
          'feedback': 'Avis',
          'support': 'Support',
          'custom-order': 'Commande spéciale',
          'return': 'Retour'
        };
        
        const typeStyles = {
          'contact': 'bg-blue-100 text-blue-800',
          'feedback': 'bg-green-100 text-green-800',
          'support': 'bg-purple-100 text-purple-800',
          'custom-order': 'bg-accent-light bg-opacity-20 text-accent',
          'return': 'bg-red-100 text-red-800'
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            typeStyles[form.type] || 'bg-gray-100 text-gray-800'
          }`} style={form.type === 'custom-order' ? { color: 'var(--color-accent)' } : {}}>
            {typeLabels[form.type] || form.type || 'Inconnu'}
          </span>
        );
      }
    },
    {
      id: 'subject',
      header: 'Sujet',
      accessor: (form) => form.subject || 'N/A',
      sortable: true,
      cell: (form) => (
        <div className="max-w-xs truncate" title={form.subject}>
          {form.subject || 'N/A'}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Statut',
      accessor: (form) => form.status || 'pending',
      sortable: true,
      cell: (form) => {
        const statusLabels = {
          'pending': 'En attente',
          'in-progress': 'En cours',
          'completed': 'Traité',
          'closed': 'Fermé'
        };
        
        const statusStyles = {
          'pending': 'bg-yellow-100 text-yellow-800',
          'in-progress': 'bg-blue-100 text-blue-800',
          'completed': 'bg-green-100 text-green-800',
          'closed': 'bg-gray-100 text-gray-800'
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusStyles[form.status] || statusStyles.pending
          }`}>
            {statusLabels[form.status] || 'En attente'}
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
      onClick: (form) => handleViewForm(form)
    },
    {
      name: 'Répondre',
      className: 'text-accent hover:text-accent-dark',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      onClick: (form) => handleRespondForm(form),
      isDisabled: (form) => form.status === 'completed' || form.status === 'closed'
    },
    {
      name: 'Marquer comme traité',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      onClick: (form) => handleMarkAsCompleted(form),
      isDisabled: (form) => form.status === 'completed' || form.status === 'closed'
    }
  ];

  // Modal handlers
  const handleViewForm = (form) => {
    setModalMode('view');
    setCurrentForm(form);
    setIsModalOpen(true);
  };

  const handleRespondForm = (form) => {
    setModalMode('respond');
    setCurrentForm(form);
    setResponseText(form.response || '');
    setIsModalOpen(true);
  };

  const handleMarkAsCompleted = async (form) => {
    try {
      await adminService.updateForm(form._id, { status: 'completed' });
      showSuccess('Formulaire marqué comme traité');
      fetchForms(); // Refresh the list
    } catch (error) {
      showError('Erreur lors de la mise à jour du statut du formulaire', {
        title: 'Échec de la mise à jour'
      });
      console.error('Error updating form status:', error);
    }
  };

  // Handle form response submission
  const handleSubmitResponse = async () => {
    try {
      await adminService.updateForm(currentForm._id, {
        response: responseText,
        status: 'completed',
        respondedAt: new Date().toISOString()
      });
      showSuccess('Réponse envoyée avec succès');
      setIsModalOpen(false);
      fetchForms(); // Refresh the list
    } catch (error) {
      showError('Erreur lors de l\'envoi de la réponse', {
        title: 'Échec de l\'envoi'
      });
      console.error('Error sending form response:', error);
    }
  };

  // Handle filter changes
  const handleTypeFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Render form details for view mode
  const renderFormDetails = () => {
    if (!currentForm) return null;
    
    const typeLabels = {
      'contact': 'Contact',
      'feedback': 'Avis',
      'support': 'Support',
      'custom-order': 'Commande spéciale',
      'return': 'Retour'
    };
    
    return (
      <div className="space-y-6">
        {/* Form Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {currentForm.subject || 'Sans sujet'}
            </h3>
            <p className="text-sm text-gray-500">
              Soumis le {new Date(currentForm.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              currentForm.type === 'contact' ? 'bg-blue-100 text-blue-800' :
              currentForm.type === 'feedback' ? 'bg-green-100 text-green-800' :
              currentForm.type === 'support' ? 'bg-purple-100 text-purple-800' :
              currentForm.type === 'custom-order' ? 'bg-accent-light bg-opacity-20' :
              currentForm.type === 'return' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`} style={currentForm.type === 'custom-order' ? { color: 'var(--color-accent)' } : {}}>
              {typeLabels[currentForm.type] || currentForm.type || 'Inconnu'}
            </span>
          </div>
        </div>
        
        {/* Submitter Info */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Informations du contact</h4>
          <p className="text-sm text-gray-900 mb-1">
            <span className="font-medium">Nom:</span> {currentForm.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-900 mb-1">
            <span className="font-medium">Email:</span> {currentForm.email || 'N/A'}
          </p>
          {currentForm.phone && (
            <p className="text-sm text-gray-900">
              <span className="font-medium">Téléphone:</span> {currentForm.phone}
            </p>
          )}
        </div>
        
        {/* Message Content */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
          <div className="bg-white border border-gray-200 rounded-md p-4 whitespace-pre-wrap">
            {currentForm.message || 'Aucun message'}
          </div>
        </div>
        
        {/* Additional fields for specific form types */}
        {currentForm.type === 'custom-order' && currentForm.orderDetails && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Détails de la commande spéciale</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-900 mb-1">
                <span className="font-medium">Type de produit:</span> {currentForm.orderDetails.productType || 'N/A'}
              </p>
              <p className="text-sm text-gray-900 mb-1">
                <span className="font-medium">Quantité:</span> {currentForm.orderDetails.quantity || 'N/A'}
              </p>
              <p className="text-sm text-gray-900">
                <span className="font-medium">Budget:</span> {currentForm.orderDetails.budget || 'N/A'}
              </p>
            </div>
          </div>
        )}
        
        {/* Response section if available */}
        {currentForm.response && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Notre réponse</h4>
            <div className="bg-accent-light bg-opacity-10 border border-accent border-opacity-20 rounded-md p-4 whitespace-pre-wrap" style={{ borderColor: 'var(--color-accent)', borderOpacity: 0.2 }}>
              {currentForm.response}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Répondu le {new Date(currentForm.respondedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
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
            <h1 className="text-2xl font-semibold text-gray-800">Gestion des formulaires</h1>
            <p className="text-gray-500">Gérez les demandes de contact et les formulaires clients</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
              value={filterType}
              onChange={handleTypeFilterChange}
            >
              <option value="all">Tous les types</option>
              <option value="contact">Contact</option>
              <option value="feedback">Avis</option>
              <option value="support">Support</option>
              <option value="custom-order">Commande spéciale</option>
              <option value="return">Retour</option>
            </select>
            <select
              className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
              value={filterStatus}
              onChange={handleStatusFilterChange}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Traité</option>
              <option value="closed">Fermé</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredForms}
          actions={actions}
          isLoading={loading}
          emptyMessage="Aucun formulaire trouvé"
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'view' 
            ? 'Détails du formulaire'
            : 'Répondre au formulaire'
        }
        size="large"
        footer={
          modalMode === 'respond' && (
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark"
                onClick={handleSubmitResponse}
                style={{ 
                  backgroundColor: 'var(--color-accent)', 
                  ':hover': { backgroundColor: 'var(--color-accent-dark)' } 
                }}
              >
                Envoyer la réponse
              </button>
            </div>
          )
        }
      >
        {modalMode === 'view' ? (
          renderFormDetails()
        ) : (
            <div className="space-y-6">
            {/* Contact info and message preview */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Informations du contact</h4>
              <p className="text-sm text-gray-900 mb-1">
                <span className="font-medium">Nom:</span> {currentForm?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-900 mb-1">
                <span className="font-medium">Email:</span> {currentForm?.email || 'N/A'}
              </p>
              {currentForm?.phone && (
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Téléphone:</span> {currentForm.phone}
                </p>
              )}
            </div>
            
            {/* Original message */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Message original</h4>
              <div className="bg-white border border-gray-200 rounded-md p-4 whitespace-pre-wrap text-sm">
                {currentForm?.message || 'Aucun message'}
              </div>
            </div>
            
            {/* Response textarea */}
            <div>
              <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                Votre réponse
              </label>
              <textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
                style={{ '--tw-ring-color': 'var(--color-accent)' }}
                required
                placeholder="Tapez votre réponse ici..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Cette réponse sera envoyée à l'adresse email du contact et le formulaire sera marqué comme traité.
              </p>
            </div>
            
            {/* Response templates */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Modèles de réponse</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  type="button"
                  className="text-left text-sm border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
                  onClick={() => setResponseText(`Cher/Chère ${currentForm?.name},\n\nMerci pour votre message. Nous l'avons bien reçu et nous allons traiter votre demande dans les plus brefs délais.\n\nCordialement,\nL'équipe BRENDT`)}
                >
                  Accusé de réception standard
                </button>
                <button
                  type="button"
                  className="text-left text-sm border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
                  onClick={() => setResponseText(`Cher/Chère ${currentForm?.name},\n\nMerci de l'intérêt que vous portez à notre collection. Suite à votre demande concernant une commande spéciale, nous sommes heureux de vous informer que cela est possible.\n\nPour discuter de vos besoins spécifiques, pourriez-vous nous contacter au 05XXXXXXXX aux heures d'ouverture?\n\nCordialement,\nL'équipe BRENDT`)}
                >
                  Réponse commande spéciale
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}