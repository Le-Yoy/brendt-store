'use client';

import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { userService } from '../../../services';
import styles from './profile.module.css';
import { FiUser, FiLock, FiMail, FiPhone, FiCalendar, FiGlobe, FiShield } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthdate: user?.birthdate || '',
    gender: user?.gender || '',
    language: user?.language || 'fr'
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    emailPromotions: user?.preferences?.emailPromotions ?? true,
    restockNotifications: user?.preferences?.restockNotifications ?? false,
    orderUpdates: user?.preferences?.orderUpdates ?? true,
    personalizedSuggestions: user?.preferences?.personalizedSuggestions ?? true
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(null);
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePreferencesChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');
    
    try {
      await updateProfile(personalInfo);
      setSuccess('Vos informations personnelles ont été mises à jour avec succès.');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour de vos informations.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess('');
    
    try {
      await userService.updatePassword(passwordInfo);
      setSuccess('Votre mot de passe a été mis à jour avec succès.');
      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour de votre mot de passe.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');
    
    try {
      await userService.updateUserPreferences(preferences);
      setSuccess('Vos préférences ont été mises à jour avec succès.');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour de vos préférences.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.profilePage}>
      <div className={styles.pageHeader}>
        <h1>Mes Informations</h1>
        <p className={styles.pageSubtitle}>
          L'essence de votre présence parmi nous
        </p>
      </div>
      
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'personal' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <FiUser />
          <span>Informations Personnelles</span>
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'security' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <FiLock />
          <span>Sécurité</span>
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'preferences' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <FiShield />
          <span>Préférences</span>
        </button>
      </div>
      
      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {activeTab === 'personal' && (
        <form onSubmit={handlePersonalInfoSubmit} className={styles.formContainer}>
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="name">
                <FiUser />
                <span>Nom et prénom</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">
                <FiMail />
                <span>Email</span>
              </label>
              <div className={styles.emailField}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className={styles.inputField}
                  required
                />
                {user.emailVerified ? (
                  <span className={styles.verifiedBadge}>Vérifié</span>
                ) : (
                  <button type="button" className={styles.verifyButton}>
                    Vérifier
                  </button>
                )}
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">
                  <FiPhone />
                  <span>Téléphone</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className={styles.inputField}
                  placeholder="+212 600 000 000"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="birthdate">
                  <FiCalendar />
                  <span>Date de naissance</span>
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={personalInfo.birthdate}
                  onChange={handlePersonalInfoChange}
                  className={styles.inputField}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="gender">
                  <FiUser />
                  <span>Genre (Optionnel)</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={personalInfo.gender}
                  onChange={handlePersonalInfoChange}
                  className={styles.selectField}
                >
                  <option value="">Préfère ne pas préciser</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="language">
                  <FiGlobe />
                  <span>Langue préférée</span>
                </label>
                <select
                  id="language"
                  name="language"
                  value={personalInfo.language}
                  onChange={handlePersonalInfoChange}
                  className={styles.selectField}
                >
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      )}
      
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className={styles.formContainer}>
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">
                <FiLock />
                <span>Mot de passe actuel</span>
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordInfo.currentPassword}
                onChange={handlePasswordChange}
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">
                <FiLock />
                <span>Nouveau mot de passe</span>
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordInfo.newPassword}
                onChange={handlePasswordChange}
                className={styles.inputField}
                required
                minLength={8}
              />
              <div className={styles.passwordStrength}>
                <div className={styles.strengthTrack}>
                  <div 
                    className={styles.strengthFill} 
                    style={{ 
                      width: passwordInfo.newPassword.length < 8 ? '25%' : 
                             passwordInfo.newPassword.length < 12 ? '50%' : 
                             passwordInfo.newPassword.match(/[a-z]/) && 
                             passwordInfo.newPassword.match(/[A-Z]/) && 
                             passwordInfo.newPassword.match(/[0-9]/) ? '100%' : '75%' 
                    }}
                  ></div>
                </div>
                <span>Le mot de passe doit contenir au moins 8 caractères</span>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">
                <FiLock />
                <span>Confirmer le mot de passe</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordInfo.confirmPassword}
                onChange={handlePasswordChange}
                className={styles.inputField}
                required
              />
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </div>
        </form>
      )}
      
      {activeTab === 'preferences' && (
        <form onSubmit={handlePreferencesSubmit} className={styles.formContainer}>
          <div className={styles.formSection}>
            <div className={styles.preferenceGroup}>
              <div className={styles.preferenceToggle}>
                <input
                  type="checkbox"
                  id="emailPromotions"
                  name="emailPromotions"
                  checked={preferences.emailPromotions}
                  onChange={handlePreferencesChange}
                  className={styles.toggleInput}
                />
                <label htmlFor="emailPromotions" className={styles.toggleLabel}></label>
                <div className={styles.preferenceInfo}>
                  <h3>Emails promotionnels</h3>
                  <p>Recevez nos offres spéciales et nouveautés</p>
                </div>
              </div>
            </div>
            
            <div className={styles.preferenceGroup}>
              <div className={styles.preferenceToggle}>
                <input
                  type="checkbox"
                  id="restockNotifications"
                  name="restockNotifications"
                  checked={preferences.restockNotifications}
                  onChange={handlePreferencesChange}
                  className={styles.toggleInput}
                />
                <label htmlFor="restockNotifications" className={styles.toggleLabel}></label>
                <div className={styles.preferenceInfo}>
                  <h3>Notifications de réapprovisionnement</h3>
                  <p>Soyez alerté lorsqu'un produit est de nouveau disponible</p>
                </div>
              </div>
            </div>
            
            <div className={styles.preferenceGroup}>
              <div className={styles.preferenceToggle}>
                <input
                  type="checkbox"
                  id="orderUpdates"
                  name="orderUpdates"
                  checked={preferences.orderUpdates}
                  onChange={handlePreferencesChange}
                  className={styles.toggleInput}
                />
                <label htmlFor="orderUpdates" className={styles.toggleLabel}></label>
                <div className={styles.preferenceInfo}>
                  <h3>Mises à jour sur les commandes</h3>
                  <p>Suivez l'état de vos commandes en temps réel</p>
                </div>
              </div>
            </div>
            
            <div className={styles.preferenceGroup}>
              <div className={styles.preferenceToggle}>
                <input
                  type="checkbox"
                  id="personalizedSuggestions"
                  name="personalizedSuggestions"
                  checked={preferences.personalizedSuggestions}
                  onChange={handlePreferencesChange}
                  className={styles.toggleInput}
                />
                <label htmlFor="personalizedSuggestions" className={styles.toggleLabel}></label>
                <div className={styles.preferenceInfo}>
                  <h3>Suggestions personnalisées</h3>
                  <p>Recevez des recommandations basées sur vos préférences</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Mise à jour...' : 'Enregistrer les préférences'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}