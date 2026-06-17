'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotification } from '@/contexts/NotificationContext';
import adminService from '@/services/adminService';
import atelierService from '@/services/atelierService';

export default function AdminUsersPage() {
  const { showSuccess, showError } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLink, setInviteLink] = useState(null);
  const [generatingInvite, setGeneratingInvite] = useState(false);
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

  const formatDate = (createdAt) => {
    if (!createdAt) return 'N/A';
    return new Date(createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  // Generate a single-use atelier invite link to send to staff (e.g. Simo).
  const handleGenerateInvite = async () => {
    try {
      setGeneratingInvite(true);
      const res = await atelierService.createInvite({ role: 'atelier', label: 'Atelier' });
      const token = res?.data?.token;
      if (!token) throw new Error('No token returned');
      const link = `${window.location.origin}/signup/${token}`;
      setInviteLink(link);
    } catch (error) {
      console.error('Error generating invite:', error);
      showError("Erreur lors de la génération du lien d'invitation");
    } finally {
      setGeneratingInvite(false);
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      showSuccess('Lien copié');
    } catch (e) {
      window.prompt('Copiez ce lien :', inviteLink);
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
      <div className="adm-page-header">
        <h1 className="adm-page-title">Gestion des utilisateurs</h1>
        <p className="adm-page-sub">Gérez les utilisateurs de la plateforme BRENDT</p>
      </div>

      <div className="adm-toolbar">
        <div className="adm-toolbar-spacer" />
        <button className="adm-btn" onClick={handleGenerateInvite} disabled={generatingInvite}>
          {generatingInvite ? 'Génération…' : "Inviter (Atelier)"}
        </button>
        <button className="adm-btn adm-btn--primary" onClick={handleAddUser}>
          + Ajouter un utilisateur
        </button>
      </div>

      {inviteLink && (
        <div className="adm-card adm-card-pad adm-mb-lg">
          <h3 className="adm-card-title">Lien d'invitation Atelier</h3>
          <p className="adm-stat-desc" style={{ marginBottom: '.6rem' }}>
            Envoyez ce lien à Simo. Il créera son compte (rôle Atelier). Lien à usage unique, valable 14 jours.
          </p>
          <div className="adm-row" style={{ gap: '.5rem', flexWrap: 'wrap' }}>
            <input className="adm-input" readOnly value={inviteLink} style={{ flex: 1, minWidth: 220 }} onFocus={(e) => e.target.select()} />
            <button className="adm-btn adm-btn--primary" onClick={copyInviteLink}>Copier</button>
            <button className="adm-btn adm-btn--ghost" onClick={() => setInviteLink(null)}>Fermer</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="adm-spinner" />
      ) : users.length === 0 ? (
        <div className="adm-card">
          <div className="adm-empty">
            <div className="adm-empty-title">Aucun utilisateur trouvé</div>
            Aucun utilisateur n'est enregistré pour le moment.
          </div>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Date d'inscription</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.email}>
                  <td className="adm-cell-muted" style={{ fontSize: '.78rem' }}>
                    {user._id ? user._id.substr(-6) : 'N/A'}
                  </td>
                  <td className="adm-cell-strong">{user.name || 'N/A'}</td>
                  <td className="adm-cell-muted">{user.email || 'N/A'}</td>
                  <td>
                    <span className={`adm-badge ${user.role === 'admin' ? 'adm-badge--ok' : user.role === 'atelier' ? 'adm-badge--warn' : 'adm-badge--muted'}`}>
                      {user.role === 'admin' ? 'Admin' : user.role === 'atelier' ? 'Atelier' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="adm-cell-muted">{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="adm-row" style={{ gap: '.4rem', justifyContent: 'flex-end' }}>
                      <button
                        className="adm-btn adm-btn--sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Modifier
                      </button>
                      <button
                        className="adm-btn adm-btn--sm"
                        onClick={() => handlePromoteUser(user)}
                        disabled={user.role === 'admin'}
                      >
                        Promouvoir en Admin
                      </button>
                      <button
                        className="adm-btn adm-btn--danger adm-btn--sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(16,16,18,.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="adm-card adm-card-pad"
            style={{ width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="adm-card-title">
              {modalMode === 'create' ? 'Ajouter un utilisateur' : 'Modifier un utilisateur'}
            </h2>

            <form onSubmit={handleSubmit} className="adm-stack" style={{ gap: '1rem' }}>
              <div className="adm-field">
                <label htmlFor="name" className="adm-label">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="adm-input"
                  required
                />
              </div>

              <div className="adm-field">
                <label htmlFor="email" className="adm-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="adm-input"
                  required
                />
              </div>

              <div className="adm-field">
                <label htmlFor="phone" className="adm-label">Téléphone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="adm-input"
                />
              </div>

              <div className="adm-field">
                <label htmlFor="role" className="adm-label">Rôle</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="adm-select"
                >
                  <option value="user">Utilisateur</option>
                  <option value="atelier">Atelier</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="adm-field">
                <label htmlFor="password" className="adm-label">
                  {modalMode === 'create' ? 'Mot de passe' : 'Nouveau mot de passe (laisser vide pour conserver l\'actuel)'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="adm-input"
                  required={modalMode === 'create'}
                />
                {modalMode === 'create' && (
                  <p style={{ marginTop: '.35rem', fontSize: '.78rem', color: 'var(--adm-text-faint)' }}>
                    Le mot de passe doit contenir au moins 8 caractères.
                  </p>
                )}
              </div>

              <div className="adm-row" style={{ justifyContent: 'flex-end', gap: '.5rem', marginTop: '.25rem' }}>
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="adm-btn adm-btn--primary">
                  {modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
