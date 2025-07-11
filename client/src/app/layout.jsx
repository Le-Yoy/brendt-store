// src/app/layout.jsx
'use client';

import { Cormorant, Inter } from 'next/font/google';
import { AuthProvider } from '../hooks/useAuth';
import { CartProvider } from '../contexts/CartContext';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import CookieConsent from '../components/common/CookieConsent/CookieConsent';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
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
  const pixelInitialized = useRef(false); // Prevent multiple initializations

  // Facebook Pixel initialization - ONLY ONCE
  useEffect(() => {
    if (typeof window !== 'undefined' && !pixelInitialized.current && !window.fbq) {
      // Initialize Facebook Pixel
      !(function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js'));

      // Initialize with your Pixel ID
      window.fbq('init', '1745370408995219');
      window.fbq('track', 'PageView');
      
      pixelInitialized.current = true; // Mark as initialized
    }
  }, []); // Empty dependency array - run only once

  // Track page views on route changes (but not initial load)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq && pixelInitialized.current) {
      // Only track PageView if pixel is already initialized and this is a route change
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

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
      <head>
        {/* Facebook Pixel noscript fallback */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=1745370408995219&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={isAccountPage ? 'account-body' : ''}>
        <AuthProvider>
          <CartProvider>
            {!isAdminPage && <Header />}
            <main className={`main-content ${isAccountPage ? 'account-main' : ''}`}>
              {children}
            </main>
            {!isAdminPage && <Footer />}
            <CookieConsent />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}