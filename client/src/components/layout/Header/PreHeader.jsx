// src/components/layout/Header/PreHeader.jsx
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './PreHeader.css';

const PreHeader = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="pre-header">
      <div className="container pre-header__container">
        <p className="pre-header__message">LIVRAISON GRATUITE AUJOURD'HUI DANS TOUT LE MAROC</p>
        <button
          className="pre-header__close"
          onClick={handleClose}
          aria-label="Fermer"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default PreHeader;