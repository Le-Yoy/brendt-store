// File: /src/components/account/ProfileForm/ProfileForm.jsx

import React, { useState } from 'react';
import { userService } from '../../../services';
import styles from './ProfileForm.module.css';

const ProfileForm = ({ user }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    promotions: user?.preferences?.promotions ?? true,
    orderUpdates: user?.preferences?.orderUpdates ?? true
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo({
      ...passwordInfo,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePreferencesChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: checked
    });
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!personalInfo.name.trim()) {
      newErrors.name = 'Veuillez entrer votre nom';
    }
    
    if (!personalInfo.email.trim()) {
      newErrors.email = 'Veuillez entrer votre email';
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    
    if (personalInfo.phone && !/^\d{10}$/.test(personalInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Veuillez entrer un numéro de téléphone valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordInfo = () => {
    const newErrors = {};
    
    if (!passwordInfo.currentPassword) {
      newErrors.currentPassword = 'Veuillez entrer votre mot de passe actuel';
    }
    
    if (!passwordInfo.newPassword) {
      newErrors.newPassword = 'Veuillez entrer un nouveau mot de passe';
    } else if (passwordInfo.newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (!passwordInfo.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre nouveau mot de passe';
    } else if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePersonalInfo = async (e) => {
    e.preventDefault();
    
    if (!validatePersonalInfo()) {
      return;
    }
    
    setLoading(true);
    setSuccess('');
    
    try {
      await userService.updateUserProfile(personalInfo);
      setSuccess('Vos informations personnelles ont été mises à jour avec succès');
    } catch (err) {
      console.error('Error updating personal information:', err);
      setErrors({
        form: err.message || 'Une erreur est survenue lors de la mise à jour de vos informations'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordInfo()) {
      return;
    }
    
    setLoading(true);
    setSuccess('');
    
    try {
      await userService.updatePassword(passwordInfo);
      setSuccess('Votre mot de passe a été mis à jour avec succès');
      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error updating password:', err);
      setErrors({
        form: err.message || 'Une erreur est survenue lors de la mise à jour de votre mot de passe'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setSuccess('');
    
    try {
      await userService.updateUserPreferences(preferences);
      setSuccess('Vos préférences ont été mises à jour avec succès');
    } catch (err) {
      console.error('Error updating preferences:', err);
      setErrors({
        form: err.message || 'Une erreur est survenue lors de la mise à jour de vos préférences'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileFormContainer}>
      <div className={styles.formTabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'personal' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Informations personnelles
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'password' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Changer le mot de passe
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'preferences' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Préférences de communication
        </button>
      </div>

      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}

      {errors.form && (
        <div className={styles.formError}>
          {errors.form}
        </div>
      )}

      {activeTab === 'personal' && (
        <form onSubmit={updatePersonalInfo} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nom complet *</label>
            <input
              type="text"
              id="name"
              name="name"
             value={personalInfo.name}
             onChange={handlePersonalInfoChange}
             className={errors.name ? styles.inputError : ''}
           />
           {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
         </div>
         
         <div className={styles.formGroup}>
           <label htmlFor="email">Email *</label>
           <input
             type="email"
             id="email"
             name="email"
             value={personalInfo.email}
             onChange={handlePersonalInfoChange}
             className={errors.email ? styles.inputError : ''}
           />
           {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
         </div>
         
         <div className={styles.formGroup}>
           <label htmlFor="phone">Téléphone</label>
           <input
             type="tel"
             id="phone"
             name="phone"
             value={personalInfo.phone}
             onChange={handlePersonalInfoChange}
             placeholder="0600000000"
             className={errors.phone ? styles.inputError : ''}
           />
           {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
         </div>
         
         <div className={styles.formActions}>
           <button 
             type="submit" 
             className={styles.submitButton}
             disabled={loading}
           >
             {loading ? 'Mise à jour...' : 'Mettre à jour mes informations'}
           </button>
         </div>
       </form>
     )}

     {activeTab === 'password' && (
       <form onSubmit={updatePassword} className={styles.profileForm}>
         <div className={styles.formGroup}>
           <label htmlFor="currentPassword">Mot de passe actuel *</label>
           <input
             type="password"
             id="currentPassword"
             name="currentPassword"
             value={passwordInfo.currentPassword}
             onChange={handlePasswordChange}
             className={errors.currentPassword ? styles.inputError : ''}
           />
           {errors.currentPassword && <div className={styles.errorMessage}>{errors.currentPassword}</div>}
         </div>
         
         <div className={styles.formGroup}>
           <label htmlFor="newPassword">Nouveau mot de passe *</label>
           <input
             type="password"
             id="newPassword"
             name="newPassword"
             value={passwordInfo.newPassword}
             onChange={handlePasswordChange}
             className={errors.newPassword ? styles.inputError : ''}
           />
           {errors.newPassword && <div className={styles.errorMessage}>{errors.newPassword}</div>}
           <div className={styles.passwordHint}>
             Le mot de passe doit contenir au moins 8 caractères
           </div>
         </div>
         
         <div className={styles.formGroup}>
           <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</label>
           <input
             type="password"
             id="confirmPassword"
             name="confirmPassword"
             value={passwordInfo.confirmPassword}
             onChange={handlePasswordChange}
             className={errors.confirmPassword ? styles.inputError : ''}
           />
           {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}
         </div>
         
         <div className={styles.formActions}>
           <button 
             type="submit" 
             className={styles.submitButton}
             disabled={loading}
           >
             {loading ? 'Mise à jour...' : 'Mettre à jour mon mot de passe'}
           </button>
         </div>
       </form>
     )}

     {activeTab === 'preferences' && (
       <form onSubmit={updatePreferences} className={styles.profileForm}>
         <div className={styles.preferencesSection}>
           <h3>Préférences de notification</h3>
           
           <div className={styles.formCheckbox}>
             <input
               type="checkbox"
               id="emailNotifications"
               name="emailNotifications"
               checked={preferences.emailNotifications}
               onChange={handlePreferencesChange}
             />
             <label htmlFor="emailNotifications">
               Recevoir des notifications par email
             </label>
           </div>
           
           <div className={styles.formCheckbox}>
             <input
               type="checkbox"
               id="smsNotifications"
               name="smsNotifications"
               checked={preferences.smsNotifications}
               onChange={handlePreferencesChange}
             />
             <label htmlFor="smsNotifications">
               Recevoir des notifications par SMS
             </label>
           </div>
         </div>
         
         <div className={styles.preferencesSection}>
           <h3>Préférences marketing</h3>
           
           <div className={styles.formCheckbox}>
             <input
               type="checkbox"
               id="promotions"
               name="promotions"
               checked={preferences.promotions}
               onChange={handlePreferencesChange}
             />
             <label htmlFor="promotions">
               Recevoir des offres promotionnelles et nouveautés
             </label>
           </div>
           
           <div className={styles.formCheckbox}>
             <input
               type="checkbox"
               id="orderUpdates"
               name="orderUpdates"
               checked={preferences.orderUpdates}
               onChange={handlePreferencesChange}
             />
             <label htmlFor="orderUpdates">
               Recevoir des mises à jour sur mes commandes
             </label>
           </div>
         </div>
         
         <div className={styles.formActions}>
           <button 
             type="submit" 
             className={styles.submitButton}
             disabled={loading}
           >
             {loading ? 'Mise à jour...' : 'Mettre à jour mes préférences'}
           </button>
         </div>
       </form>
     )}
   </div>
 );
};

export default ProfileForm;