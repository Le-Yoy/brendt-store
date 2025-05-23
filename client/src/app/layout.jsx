// src/app/layout.jsx
'use client';

import { Cormorant, Inter } from 'next/font/google';
import { AuthProvider } from '../hooks/useAuth'; // Use the hooks version
import { CartProvider } from '../contexts/CartContext';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { checkServerStatus } from '../utils/serverCheck';
import '../styles/globals.css';

// Initialize the fonts
const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant'
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export default function RootLayout({ children }) {
  const pathname = usePathname() || '';
  const isAccountPage = pathname.startsWith('/account');
  const isAdminPage = pathname.startsWith('/admin');

  // Check server status when component mounts
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (typeof checkServerStatus === 'function') {
        checkServerStatus();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className={isAccountPage ? 'account-body' : ''}>
        <AuthProvider>
          <CartProvider>
            {!isAdminPage && <Header />}
            <main className={`main-content ${isAccountPage ? 'account-main' : ''}`}>
              {children}
            </main>
            {!isAdminPage && <Footer />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}