// src/components/layout/ClientLayout.jsx
'use client';

import { useEffect } from 'react';
import { CartProvider } from '../../contexts/CartContext';
import Header from './Header/Header';
import Footer from './Footer/Footer';

export default function ClientLayout({ children }) {
  // Debug: Log when ClientLayout mounts/unmounts
  useEffect(() => {
    console.log("ClientLayout mounted");
    return () => {
      console.log("ClientLayout unmounted");
    };
  }, []);

  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}