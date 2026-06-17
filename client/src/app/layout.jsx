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
  const pixelInitialized = useRef(false);

  // Facebook Pixel - ACTIVE for ads tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && !pixelInitialized.current && !window.fbq) {
      // Delay FB pixel to avoid blocking initial render
      setTimeout(() => {
        !(function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js'));

        window.fbq('init', '1745370408995219', {
          external_id: null,
          agent: 'plbrendtshoes',
        });
        
        window.fbq('track', 'PageView');
        
        if (window.location.search.includes('utm_source=whatsapp')) {
          window.fbq('trackCustom', 'WhatsAppTraffic', {
            source: 'whatsapp',
            campaign: 'morocco2025',
            content_category: 'shoes'
          });
        }
        
        window.fbq('trackCustom', 'MoroccoVisitor', {
          market: 'morocco',
          brand: 'brendt',
          category: 'luxury_shoes'
        });
        
        pixelInitialized.current = true;
      }, 1000);
    }
  }, []);

  // Facebook page tracking on route changes - ACTIVE
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq && pixelInitialized.current) {
      window.fbq('track', 'PageView');
      
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

  // Check server status
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof checkServerStatus === 'function') {
        checkServerStatus();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Keep Railway server alive - ping every 10 minutes to prevent cold starts
  useEffect(() => {
    const ping = () => {
      fetch('https://brendt-store-production-d6ef.up.railway.app/api/products?limit=1')
        .catch(() => {}); // Silent - just keeping the server warm
    };

    const interval = setInterval(ping, 10 * 60 * 1000); // Every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable}`}>
     <head>
        {/* Static SEO Meta Tags */}
        <title>BRENDT Maroc - Chaussures Luxe Homme & Femme | Livraison Gratuite</title>
        <meta name="description" content="BRENDT - Chaussures de luxe Maroc. Mocassins homme, boots, chaussures femme. Livraison gratuite Casablanca, Rabat, Marrakech. À partir de 1299 MAD." />
        <meta name="keywords" content="chaussures maroc, mocassin homme maroc, chaussure femme maroc, brendt, boots maroc" />

        {/* PWA / Add-to-Home-Screen (iOS + Android) */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#111113" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Open Graph */}
        <meta property="og:title" content="BRENDT - Chaussures de Luxe Maroc" />
        <meta property="og:description" content="Collection exclusive de chaussures haut de gamme. Livraison gratuite au Maroc." />
        <meta property="og:url" content="https://www.brendtshoes.com" />
        
        {/* Preconnect hints for performance */}
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="preconnect" href="https://brendt-store-production-d6ef.up.railway.app" />
        <link rel="dns-prefetch" href="https://brendt-store-production-d6ef.up.railway.app" />
        
        {/* COMMENTED OUT - Google Analytics 4 - Uncomment to restore */}
        {/*
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
        */}
        
        {/* Facebook Domain Verification - ACTIVE */}
        <meta name="facebook-domain-verification" content="ypxs2rf849bqvwbo6j0ytdkwdsgrgu" />
        
        {/* Facebook meta tags - ACTIVE */}
        <meta property="og:site_name" content="BRENDT" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="1745370408995219" />
        
        {/* COMMENTED OUT - Voiceflow Chat Widget - Uncomment to restore */}
        {/*
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(d, t) {
                var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
                v.onload = function() {
                  window.voiceflow.chat.load({
                    verify: { projectID: '6892909cf206c1eb081185ae' },
                    url: 'https://general-runtime.voiceflow.com',
                    versionID: 'production',
                    voice: {
                      url: "https://runtime-api.voiceflow.com"
                    }
                  });
                }
                v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
            })(document, 'script');
          `
        }} />
        */}
        
        {/* Facebook Pixel noscript fallback - ACTIVE */}
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
            <main className={`main-content ${isAccountPage ? 'account-main' : ''} ${isAdminPage ? 'admin-main' : ''}`}>
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