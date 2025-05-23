// File: /src/components/account/AddressBook/AddressBook.jsx

import React, { useState, useEffect } from 'react';
import { addressService } from '../../../services';
import AddressList from './AddressList';
import AddressForm from './AddressForm';
import styles from './AddressBook.module.css';

const AddressBook = ({ user }) => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        console.log('[ADDRESSES] Fetching user addresses...');
        const addressData = await addressService.getUserAddresses(); // CORRECT METHOD NAME
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

  const handleAddAddress = () => {
    setCurrentAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      try {
        setLoading(true);
        const updatedAddresses = await addressService.deleteAddress(addressId);
        
        // Check if we got a valid response
        if (Array.isArray(updatedAddresses)) {
          setAddresses(updatedAddresses);
        } else {
          // Fallback to local update if API doesn't return updated list
          setAddresses(addresses.filter(addr => addr._id !== addressId));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error deleting address:', err);
        setError('Impossible de supprimer l\'adresse. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true);
      const updatedAddresses = await addressService.setDefaultAddress(addressId);
      
      // Check if we got a valid response
      if (Array.isArray(updatedAddresses)) {
        setAddresses(updatedAddresses);
      } else {
        // Fallback to local update if API doesn't return updated list
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId
        })));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error setting default address:', err);
      setError('Impossible de définir l\'adresse par défaut. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (addressData) => {
    try {
      setLoading(true);
      
      let updatedAddresses;
      if (currentAddress) {
        // Edit existing address
        updatedAddresses = await addressService.updateAddress(currentAddress._id, addressData);
      } else {
        // Add new address
        updatedAddresses = await addressService.addAddress(addressData);
      }
      
      // Check if we got a valid response
      if (Array.isArray(updatedAddresses)) {
        setAddresses(updatedAddresses);
      } else if (currentAddress) {
        // Fallback local update for editing
        setAddresses(addresses.map(addr => 
          addr._id === currentAddress._id ? {...addr, ...addressData} : addr
        ));
      } else {
        // Fallback local update for adding
        const newAddress = {...addressData, _id: Date.now().toString()};
        setAddresses([...addresses, newAddress]);
      }
      
      setShowForm(false);
      setCurrentAddress(null);
      setError(null);
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Impossible de sauvegarder l\'adresse. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentAddress(null);
  };

  const handleRetry = () => {
    // Reset error and try loading again
    setError(null);
    setLoading(true);
    // Fetch addresses again
    addressService.getUserAddresses()
      .then(addressData => {
        if (Array.isArray(addressData)) {
          setAddresses(addressData);
        } else {
          setAddresses([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error retrying address fetch:', err);
        setError('Impossible de charger vos adresses. Veuillez réessayer.');
        setLoading(false);
      });
  };

  if (loading) {
    return <div className={styles.loading}>Chargement de vos adresses...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
        <button onClick={handleRetry} className={styles.retryButton}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className={styles.addressBookContainer}>
      {showForm ? (
        <AddressForm 
          address={currentAddress}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <div className={styles.addressBookHeader}>
            <h2>Mes adresses de livraison</h2>
            <button 
              className={styles.addAddressButton}
              onClick={handleAddAddress}
            >
              Ajouter une adresse
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Vous n'avez pas encore enregistré d'adresse.</p>
              <button 
                className={styles.addAddressButtonLarge}
                onClick={handleAddAddress}
              >
                Ajouter ma première adresse
              </button>
            </div>
          ) : (
            <AddressList 
              addresses={addresses}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefaultAddress}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AddressBook;