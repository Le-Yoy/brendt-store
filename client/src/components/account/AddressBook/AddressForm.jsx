// File: /src/components/account/AddressBook/AddressForm.jsx

import React, { useState } from 'react';
import styles from './AddressBook.module.css';

const AddressForm = ({ address, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: address?.fullName || '',
    address: address?.address || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'Maroc',
    phoneNumber: address?.phoneNumber || '',
    isDefault: address?.isDefault || false
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Veuillez entrer un nom complet';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Veuillez entrer une adresse';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Veuillez entrer une ville';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Veuillez entrer un code postal';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Veuillez entrer un numéro de téléphone';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Veuillez entrer un numéro de téléphone valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={styles.addressFormContainer}>
      <h2>{address ? 'Modifier l\'adresse' : 'Ajouter une adresse'}</h2>
      
      <form onSubmit={handleSubmit} className={styles.addressForm}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Nom complet *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? styles.inputError : ''}
          />
          {errors.fullName && <div className={styles.errorMessage}>{errors.fullName}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="address">Adresse *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? styles.inputError : ''}
          />
          {errors.address && <div className={styles.errorMessage}>{errors.address}</div>}
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="city">Ville *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? styles.inputError : ''}
            />
            {errors.city && <div className={styles.errorMessage}>{errors.city}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="postalCode">Code postal *</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={errors.postalCode ? styles.inputError : ''}
            />
            {errors.postalCode && <div className={styles.errorMessage}>{errors.postalCode}</div>}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="country">Pays *</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="Maroc">Maroc</option>
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Canada">Canada</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber">Numéro de téléphone *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="0600000000"
            className={errors.phoneNumber ? styles.inputError : ''}
          />
          {errors.phoneNumber && <div className={styles.errorMessage}>{errors.phoneNumber}</div>}
        </div>
        
        <div className={styles.formCheckbox}>
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          <label htmlFor="isDefault">Définir comme adresse par défaut</label>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
          >
            {address ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;