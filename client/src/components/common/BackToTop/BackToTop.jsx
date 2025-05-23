// src/components/common/BackToTop/BackToTop.jsx
import React from 'react';
import { FiArrowUp } from 'react-icons/fi';
import './BackToTop.css';

const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      className="back-to-top" 
      onClick={scrollToTop}
      aria-label="Retour en haut"
    >
      <FiArrowUp />
    </button>
  );
};

export default BackToTop;