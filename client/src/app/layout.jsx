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

  // Enhanced Facebook Pixel initialization for campaign optimization
  useEffect(() => {
    if (typeof window !== 'undefined' && !pixelInitialized.current && !window.fbq) {
      // Initialize Facebook Pixel with advanced settings
      !(function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js'));

      // Initialize with your Pixel ID and enhanced settings
      window.fbq('init', '1745370408995219', {
        // Enable automatic advanced matching for better attribution
        external_id: null,
        // Enhanced attribution settings
        agent: 'plbrendtshoes',
      });
      
      // Track initial page view
      window.fbq('track', 'PageView');
      
      // Track WhatsApp campaign traffic immediately
      if (typeof window !== 'undefined' && window.location.search.includes('utm_source=whatsapp')) {
        window.fbq('trackCustom', 'WhatsAppTraffic', {
          source: 'whatsapp',
          campaign: 'morocco2025',
          content_category: 'shoes'
        });
      }
      
      // Track Morocco-specific audience data
      window.fbq('trackCustom', 'MoroccoVisitor', {
        market: 'morocco',
        brand: 'brendt',
        category: 'luxury_shoes'
      });
      
      pixelInitialized.current = true; // Mark as initialized
      console.log('🔥 Facebook Pixel initialized for campaign optimization');
    }
  }, []); // Empty dependency array - run only once

  // Enhanced page view tracking on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq && pixelInitialized.current) {
      // Track page view with additional context
      window.fbq('track', 'PageView');
      
      // Track specific page types for better audience building
      if (pathname.includes('/product/')) {
        window.fbq('trackCustom', 'ProductPageView', {
          page_type: 'product',
          content_category: 'shoes'
        });
      } else if (pathname.includes('/category/')) {
        window.fbq('trackCustom', 'CategoryPageView', {
          page_type: 'category',
          content_category: 'shoes'
        });
      } else if (pathname.includes('/checkout')) {
        window.fbq('trackCustom', 'CheckoutPageView', {
          page_type: 'checkout',
          intent: 'high'
        });
      }
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
        {/* Google Analytics 4 - Direct Script Integration */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YQQBFRN2E0"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YQQBFRN2E0', {
              country: 'MA',
              currency: 'MAD',
              custom_map: {
                'custom_parameter_1': 'morocco_campaign'
              }
            });
            console.log('📊 Google Analytics 4 loaded for Morocco campaign');
          `
        }} />
        
        {/* Facebook Domain Verification for Campaign Trust */}
        <meta name="facebook-domain-verification" content="ypxs2rf849bqvwbo6j0ytdkwdsgrgu" />
        
        {/* Enhanced meta tags for better Facebook attribution */}
        <meta property="og:site_name" content="BRENDT" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="1745370408995219" />
        
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