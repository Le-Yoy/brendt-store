// File: /src/components/account/AddressBook/AddressCard.jsx

import React from 'react';
import styles from './AddressBook.module.css';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className={`${styles.addressCard} ${address.isDefault ? styles.defaultAddress : ''}`}>
      {address.isDefault && (
        <div className={styles.defaultBadge}>
          Adresse par défaut
        </div>
      )}
      
      <div className={styles.addressContent}>
        <h3>{address.fullName}</h3>
        <p>{address.address}</p>
        <p>{address.postalCode} {address.city}</p>
        <p>{address.country}</p>
        <p>{address.phoneNumber}</p>
      </div>
      
      <div className={styles.addressActions}>
        <button 
          className={styles.editButton}
          onClick={onEdit}
        >
          Modifier
        </button>
        
        {!address.isDefault && (
          <>
            <button 
              className={styles.defaultButton}
              onClick={onSetDefault}
            >
              Définir par défaut
            </button>
            
            <button 
              className={styles.deleteButton}
              onClick={onDelete}
            >
              Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressCard;