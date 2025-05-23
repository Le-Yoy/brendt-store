// src/components/layout/Layout.jsx
import React, { useState, useEffect } from 'react';
// Update these paths to the actual locations of the components
import Header from './Header/index';
import Footer from './Footer/index';
import BackToTop from '../common/BackToTop/index';
import './Layout.css';

const Layout = ({ children }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      {showBackToTop && <BackToTop />}
    </div>
  );
};

export default Layout;