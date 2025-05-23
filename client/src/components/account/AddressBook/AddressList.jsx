// File: /src/components/account/AddressBook/AddressList.jsx

import React from 'react';
import AddressCard from './AddressCard';
import styles from './AddressBook.module.css';

const AddressList = ({ addresses, onEdit, onDelete, onSetDefault }) => {
  // Sort addresses to show default first
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

  return (
    <div className={styles.addressList}>
      {sortedAddresses.map(address => (
        <AddressCard
          key={address._id}
          address={address}
          onEdit={() => onEdit(address)}
          onDelete={() => onDelete(address._id)}
          onSetDefault={() => onSetDefault(address._id)}
        />
      ))}
    </div>
  );
};

export default AddressList;