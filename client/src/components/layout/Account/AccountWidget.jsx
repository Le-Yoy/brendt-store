// src/components/layout/Account/AccountWidget.jsx
import React from 'react';
import { FiX, FiUser, FiPackage, FiMapPin, FiLogOut, FiHeart, FiSettings } from 'react-icons/fi';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './AccountWidget.css';

const AccountWidget = ({ isOpen, onClose }) => {
  const { user, login, logout, loading, isAuthenticated, error: authError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Track login success state for smooth UX
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  // FIXED: Perfect UX - Show success state, then close gracefully
  React.useEffect(() => {
    if (loginSuccess && isAuthenticated && user && !loading) {
      console.log('[ACCOUNT WIDGET] Showing success state...');
      
      // Show the logged-in state for 1.5 seconds so user sees they're connected
      const successTimer = setTimeout(() => {
        console.log('[ACCOUNT WIDGET] Closing after showing success');
        onClose();
        setLoginSuccess(false); // Reset for next time
      }, 1500);

      return () => clearTimeout(successTimer);
    }
  }, [loginSuccess, isAuthenticated, user, loading, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('[ACCOUNT WIDGET] Form submitted');
    
    // Clear any existing errors
    setError(null);
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log('[ACCOUNT WIDGET] Attempting login with:', {
        email: formData.email,
        password: '***hidden***'
      });
      
      // Call the login function
      const success = await login(formData.email, formData.password);
      
      console.log('[ACCOUNT WIDGET] Login result:', success);
      
      if (success) {
        console.log('[ACCOUNT WIDGET] Login successful!');
        
        // Clear form
        setFormData({ email: '', password: '', remember: false });
        
        // FIXED: Trigger success flow - show user they're logged in, then close
        setLoginSuccess(true);
      } else {
        console.log('[ACCOUNT WIDGET] Login failed');
        setError(authError || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error('[ACCOUNT WIDGET] Login error:', err);
      setError(err.message || 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    console.log('[ACCOUNT WIDGET] Logging out');
    logout();
    onClose();
    router.push('/');
  };

  const navigateTo = (path) => {
    console.log('[ACCOUNT WIDGET] Navigating to:', path);
    router.push(path);
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className={`account-widget open`}>
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
          // Logged in view - show success state with smooth transition
          <>
            <div className="account-widget__user-info">
              <div className="account-widget__avatar">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="account-widget__welcome">Bienvenue,</p>
                <p className="account-widget__name">{user.name}</p>
              </div>
              {/* Show success indicator when just logged in */}
              {loginSuccess && (
                <div style={{
                  marginLeft: 'auto',
                  color: '#28a745',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  ✓ Connecté
                </div>
              )}
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
              {/* Show any errors */}
              {(error || authError) && (
                <div className="account-widget__error">
                  {error || authError}
                </div>
              )}
              
              <div className="account-widget__form-group">
                <label htmlFor="widget-email">Email</label>
                <input
                  type="email"
                  id="widget-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="account-widget__input"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
              
              <div className="account-widget__form-group">
                <label htmlFor="widget-password">Mot de passe</label>
                <input
                  type="password"
                  id="widget-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="account-widget__input"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>
              
              <div className="account-widget__form-group account-widget__checkbox">
                <input
                  type="checkbox"
                  id="widget-remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="account-widget__checkbox-input"
                  disabled={isSubmitting}
                />
                <label htmlFor="widget-remember">Se souvenir de moi</label>
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
              <Link href="/forgot-password" className="account-widget__forgot-link" onClick={onClose}>
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