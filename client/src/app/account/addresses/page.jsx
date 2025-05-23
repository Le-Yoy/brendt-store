// src/app/account/addresses/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { addressService } from '../../../services';
import styles from './addresses.module.css';
import { FiPlus, FiMapPin, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

export default function AddressesPage() {
  return (
    <ProtectedRoute>
      <AddressesContent />
    </ProtectedRoute>
  );
}

function AddressesContent() {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullName: '',
    phoneNumber: '',
    city: '',
    address: '',
    additionalInfo: '',
    postalCode: '',
    deliveryInstructions: '',
    isDefaultShipping: false,
    isDefaultBilling: false
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        console.log('[ADDRESSES] Fetching user addresses...');
        const addressData = await addressService.getUserAddresses(); // Changed to getUserAddresses
        console.log('[ADDRESSES] Addresses received:', addressData);
        
        // Check if we actually got an array
        if (Array.isArray(addressData)) {
          setAddresses(addressData);
          setError(null);
        } else {
          console.error('[ADDRESSES] Received non-array address data:', addressData);
          setAddresses([]);
          setError('Format des données d\'adresse incorrect. Veuillez contacter le support.');
        }
      } catch (err) {
        console.error('[ADDRESSES] Error fetching addresses:', err);
        setError('Impossible de charger vos adresses. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Rest of the component remains unchanged
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (editingAddress) {
      setEditingAddress({
        ...editingAddress,
        [name]: inputValue
      });
    } else {
      setNewAddress({
        ...newAddress,
        [name]: inputValue
      });
    }
  };

  const handleAddAddress = () => {
    setShowAddForm(true);
    setEditingAddress(null);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setNewAddress({
      label: '',
      fullName: '',
      phoneNumber: '',
      city: '',
      address: '',
      additionalInfo: '',
      postalCode: '',
      deliveryInstructions: '',
      isDefaultShipping: false,
      isDefaultBilling: false
    });
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (editingAddress) {
        // Update existing address
        const updatedAddresses = await addressService.updateAddress(
          editingAddress._id,
          editingAddress
        );
        setAddresses(updatedAddresses);
      } else {
        // Add new address
        const updatedAddresses = await addressService.addAddress(newAddress);
        setAddresses(updatedAddresses);
      }
      
      handleCancelForm();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      try {
        const updatedAddresses = await addressService.deleteAddress(addressId);
        setAddresses(updatedAddresses);
      } catch (err) {
        setError(err.message || 'Impossible de supprimer l\'adresse. Veuillez réessayer.');
      }
    }
  };

  const handleSetDefaultAddress = async (addressId, type) => {
    try {
      const updatedAddresses = await addressService.setDefaultAddress(addressId, type);
      setAddresses(updatedAddresses);
    } catch (err) {
      setError(err.message || 'Impossible de définir l\'adresse par défaut. Veuillez réessayer.');
    }
  };

  return (
    <div className={styles.addressesPage}>
      <div className={styles.pageHeader}>
        <h1>Mes Adresses</h1>
        <p className={styles.pageSubtitle}>
          Là où vos pas vous mènent, nos créations vous accompagnent
        </p>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.addressActions}>
        <button 
          className={styles.addAddressButton}
          onClick={handleAddAddress}
        >
          <FiPlus />
          <span>Ajouter une nouvelle adresse</span>
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement de vos adresses...</p>
        </div>
      ) : showAddForm ? (
        <div className={styles.addressForm}>
          <h2>{editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}</h2>
          
          <form onSubmit={handleSubmitAddress}>
            {/* Form content remains the same */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="label">Nom de l'adresse</label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={editingAddress ? editingAddress.label : newAddress.label}
                  onChange={handleInputChange}
                  placeholder="Ex: Domicile, Bureau"
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Nom complet</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={editingAddress ? editingAddress.fullName : newAddress.fullName}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Téléphone</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={editingAddress ? editingAddress.phoneNumber : newAddress.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+212 600 000 000"
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="city">Ville</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={editingAddress ? editingAddress.city : newAddress.city}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="address">Adresse</label>
              <input
                type="text"
                id="address"
                name="address"
                value={editingAddress ? editingAddress.address : newAddress.address}
                onChange={handleInputChange}
                className={styles.inputField}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="additionalInfo">Complément d'adresse (optionnel)</label>
              <input
                type="text"
                id="additionalInfo"
                name="additionalInfo"
                value={editingAddress ? editingAddress.additionalInfo : newAddress.additionalInfo}
                onChange={handleInputChange}
                className={styles.inputField}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="postalCode">Code postal</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={editingAddress ? editingAddress.postalCode : newAddress.postalCode}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="deliveryInstructions">Instructions de livraison (optionnel)</label>
                <input
                  type="text"
                  id="deliveryInstructions"
                  name="deliveryInstructions"
                  value={editingAddress ? editingAddress.deliveryInstructions : newAddress.deliveryInstructions}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  placeholder="Ex: Code d'entrée, étage, etc."
                />
              </div>
            </div>
            
            <div className={styles.formCheckboxes}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="isDefaultShipping"
                  name="isDefaultShipping"
                  checked={editingAddress ? editingAddress.isDefaultShipping : newAddress.isDefaultShipping}
                  onChange={handleInputChange}
                  className={styles.checkboxInput}
                />
                <label htmlFor="isDefaultShipping">Définir comme adresse de livraison par défaut</label>
              </div>
              
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="isDefaultBilling"
                  name="isDefaultBilling"
                  checked={editingAddress ? editingAddress.isDefaultBilling : newAddress.isDefaultBilling}
                  onChange={handleInputChange}
                  className={styles.checkboxInput}
                />
                <label htmlFor="isDefaultBilling">Définir comme adresse de facturation par défaut</label>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={handleCancelForm}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
              >
                {editingAddress ? 'Mettre à jour' : 'Ajouter l\'adresse'}
              </button>
            </div>
          </form>
        </div>
      ) : addresses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <FiMapPin size={40} />
          </div>
          <h2>Vous n'avez pas encore d'adresses enregistrées</h2>
          <p>Là où vos pas vous mènent, nos créations vous accompagnent</p>
          <button 
            className={styles.addFirstButton}
            onClick={handleAddAddress}
          >
            Ajouter votre première adresse
          </button>
        </div>
      ) : (
        <div className={styles.addressGrid}>
          {addresses.map(address => (
            <div 
              key={address._id} 
              className={`${styles.addressCard} ${
                (address.isDefaultShipping || address.isDefaultBilling) ? styles.defaultCard : ''
              }`}
            >
              {/* Address card content remains the same */}
              {(address.isDefaultShipping || address.isDefaultBilling) && (
                <div className={styles.defaultBadge}>
                  {address.isDefaultShipping && address.isDefaultBilling ? 'Adresse par défaut' : 
                   address.isDefaultShipping ? 'Livraison par défaut' : 'Facturation par défaut'}
                </div>
              )}
              
              <div className={styles.addressLabel}>
                {address.label || 'Adresse'}
              </div>
              
              <div className={styles.addressDetails}>
                <p className={styles.fullName}>{address.fullName}</p>
                <p>{address.address}</p>
                {address.additionalInfo && <p>{address.additionalInfo}</p>}
                <p>{address.postalCode} {address.city}</p>
                <p className={styles.phoneNumber}>{address.phoneNumber}</p>
                {address.deliveryInstructions && (
                  <p className={styles.deliveryInstructions}>
                    <strong>Instructions:</strong> {address.deliveryInstructions}
                  </p>
                )}
              </div>
              
              <div className={styles.addressActions}>
                <button 
                  className={styles.editButton}
                  onClick={() => handleEditAddress(address)}
                >
                  <FiEdit2 />
                  <span>Modifier</span>
                </button>
                
                {!address.isDefaultShipping && (
                  <button 
                    className={styles.defaultButton}
                    onClick={() => handleSetDefaultAddress(address._id, 'shipping')}
                  >
                    <FiCheck />
                    <span>Définir pour livraison</span>
                  </button>
                )}
                
                {!address.isDefaultBilling && (
                  <button 
                    className={styles.defaultButton}
                    onClick={() => handleSetDefaultAddress(address._id, 'billing')}
                  >
                    <FiCheck />
                    <span>Définir pour facturation</span>
                  </button>
                )}
                
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDeleteAddress(address._id)}
                >
                  <FiTrash2 />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}