// src/components/layout/Account/AccountWidget.jsx
import React from 'react';
import { FiX, FiUser, FiPackage, FiMapPin, FiLogOut, FiHeart, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './AccountWidget.css';

const AccountWidget = ({ isOpen, onClose }) => {
  const { user, login, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Updated to pass individual email and password parameters instead of the whole formData object
      await login(formData.email, formData.password);
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/');
  };

  const navigateTo = (path) => {
    router.push(path);
    onClose();
  };

  return (
    <div className={`account-widget ${isOpen ? 'open' : ''}`}>
      <div className="account-widget__header">
        <h2>{isAuthenticated ? 'Mon compte' : 'Connexion'}</h2>
        <button onClick={onClose} className="account-widget__close-btn">
          <FiX size={20} />
        </button>
      </div>

      <div className="account-widget__content">
        {loading ? (
          <div className="account-widget__loading">
            <div className="spinner"></div>
            <span>Chargement...</span>
          </div>
        ) : isAuthenticated && user ? (
          // Logged in view
          <>
            <div className="account-widget__user-info">
              <div className="account-widget__avatar">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="account-widget__welcome">Bienvenue,</p>
                <p className="account-widget__name">{user.name}</p>
              </div>
            </div>

            <div className="account-widget__menu">
              <button onClick={() => navigateTo('/account')} className="account-widget__menu-item">
                <FiUser size={18} />
                <span>Tableau de bord</span>
              </button>
              <button onClick={() => navigateTo('/account/orders')} className="account-widget__menu-item">
                <FiPackage size={18} />
                <span>Mes commandes</span>
              </button>
              <button onClick={() => navigateTo('/account/addresses')} className="account-widget__menu-item">
                <FiMapPin size={18} />
                <span>Mes adresses</span>
              </button>
              <button onClick={() => navigateTo('/account/profile')} className="account-widget__menu-item">
                <FiSettings size={18} />
                <span>Mes informations</span>
              </button>
            </div>

            <button onClick={handleLogout} className="account-widget__logout-btn">
              <FiLogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </>
        ) : (
          // Login form
          <>
            <form onSubmit={handleLogin} className="account-widget__form">
              {error && <div className="account-widget__error">{error}</div>}
              
              <div className="account-widget__form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="account-widget__input"
                />
              </div>
              
              <div className="account-widget__form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="account-widget__input"
                />
              </div>
              
              <div className="account-widget__form-group account-widget__checkbox">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="account-widget__checkbox-input"
                />
                <label htmlFor="remember">Se souvenir de moi</label>
              </div>
              
              <button 
                type="submit" 
                className="account-widget__submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
            
            <div className="account-widget__links">
              <Link href="/mot-de-passe-oublie" className="account-widget__forgot-link" onClick={onClose}>
                Mot de passe oublié?
              </Link>
              <div className="account-widget__register">
                <span>Pas encore de compte?</span>
                <Link href="/register" onClick={onClose}>
                  Créer un compte
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountWidget;