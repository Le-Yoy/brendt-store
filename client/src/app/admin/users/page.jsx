'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';

export default function AdminUsersPage() {
  const { showSuccess, showError } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: ''
  });

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      showError('Erreur lors du chargement des utilisateurs', {
        title: 'Erreur de données'
      });
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Table columns definition
  const columns = [
    {
      id: 'id',
      header: 'ID',
      accessor: (user) => user._id || 'N/A',
      sortable: true,
      width: '100px'
    },
    {
      id: 'name',
      header: 'Nom',
      accessor: (user) => user.name || 'N/A',
      sortable: true
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (user) => user.email || 'N/A',
      sortable: true
    },
    {
      id: 'role',
      header: 'Rôle',
      accessor: (user) => user.role || 'user',
      sortable: true,
      cell: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.role === 'admin' 
            ? 'bg-accent-light bg-opacity-20 text-accent' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
        </span>
      )
    },
    {
      id: 'createdAt',
      header: 'Date d\'inscription',
      accessor: (user) => user.createdAt || 'N/A',
      sortable: true,
      cell: (user) => {
        if (!user.createdAt) return 'N/A';
        return new Date(user.createdAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    }
  ];

  // Table actions
  const actions = [
    {
      name: 'Modifier',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: (user) => handleEditUser(user)
    },
    {
      name: 'Supprimer',
      className: 'text-red-600 hover:text-red-800',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: (user) => handleDeleteUser(user)
    },
    {
      name: 'Promouvoir en Admin',
      className: 'text-accent hover:text-accent-dark',
      icon: (
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      onClick: (user) => handlePromoteUser(user),
      isDisabled: (user) => user.role === 'admin'
    }
  ];

  // Modal handlers
  const handleAddUser = () => {
    setModalMode('create');
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      password: '' // Don't pre-fill password
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.name || 'cet utilisateur'} ?`)) {
      try {
        await adminService.deleteUser(user._id);
        showSuccess(`L'utilisateur ${user.name || ''} a été supprimé avec succès`);
        fetchUsers(); // Refresh the list
      } catch (error) {
        showError('Erreur lors de la suppression de l\'utilisateur', {
          title: 'Échec de la suppression'
        });
        console.error('Error deleting user:', error);
      }
    }
  };

  const handlePromoteUser = async (user) => {
    if (window.confirm(`Êtes-vous sûr de vouloir promouvoir ${user.name || 'cet utilisateur'} en tant qu'administrateur ?`)) {
      try {
        await adminService.promoteToAdmin(user._id);
        showSuccess(`${user.name || 'L\'utilisateur'} a été promu au rôle d'administrateur`);
        fetchUsers(); // Refresh the list
      } catch (error) {
        showError('Erreur lors de la promotion de l\'utilisateur', {
          title: 'Échec de la promotion'
        });
        console.error('Error promoting user:', error);
      }
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'create') {
        // Create new user
        await adminService.createUser(formData);
        showSuccess('Utilisateur créé avec succès');
      } else {
        // Update existing user
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) delete dataToUpdate.password; // Don't send empty password
        
        await adminService.updateUser(currentUser._id, dataToUpdate);
        showSuccess('Utilisateur mis à jour avec succès');
      }
      
      setIsModalOpen(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      showError(
        modalMode === 'create' 
          ? 'Erreur lors de la création de l\'utilisateur' 
          : 'Erreur lors de la mise à jour de l\'utilisateur',
        { title: 'Erreur' }
      );
      console.error('Error saving user:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Gestion des utilisateurs</h1>
            <p className="text-gray-500">Gérez les utilisateurs de la plateforme BRENDT</p>
          </div>
          <button
            className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-md transition-colors duration-200"
            style={{ 
              backgroundColor: 'var(--color-accent)', 
              ':hover': { backgroundColor: 'var(--color-accent-dark)' } 
            }}
            onClick={handleAddUser}
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter un utilisateur
            </div>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={users}
          actions={actions}
          isLoading={loading}
          emptyMessage="Aucun utilisateur trouvé"
        />
      </div>

      {/* User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Ajouter un utilisateur' : 'Modifier un utilisateur'}
        footer={
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
              {modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {modalMode === 'create' ? 'Mot de passe' : 'Nouveau mot de passe (laisser vide pour conserver l\'actuel)'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"
              style={{ '--tw-ring-color': 'var(--color-accent)' }}
              required={modalMode === 'create'}
            />
            {modalMode === 'create' && (
              <p className="mt-1 text-sm text-gray-500">
                Le mot de passe doit contenir au moins 8 caractères.
              </p>
            )}
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}