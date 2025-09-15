'use client';

import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isEU, setIsEU] = useState(false);
  const [language, setLanguage] = useState('en');

  // EU country codes that require GDPR compliance
  const euCountries = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
  ];

  // Translations for different EU languages
  const translations = {
    fr: {
      title: "Nous utilisons des cookies",
      text: "Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant, vous acceptez notre utilisation des cookies conformément à notre politique de confidentialité.",
      accept: "Accepter",
      decline: "Refuser",
      manage: "Gérer",
      company: "Boutaleb LLC d.b.a. BRENDT Shoes"
    },
    es: {
      title: "Utilizamos cookies",
      text: "Utilizamos cookies para mejorar su experiencia en nuestro sitio. Al continuar, acepta nuestro uso de cookies de acuerdo con nuestra política de privacidad.",
      accept: "Aceptar",
      decline: "Rechazar", 
      manage: "Gestionar",
      company: "Boutaleb LLC d.b.a. BRENDT Shoes"
    },
    de: {
      title: "Wir verwenden Cookies",
      text: "Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Durch Fortfahren stimmen Sie unserer Cookie-Nutzung gemäß unserer Datenschutzrichtlinie zu.",
      accept: "Akzeptieren",
      decline: "Ablehnen",
      manage: "Verwalten",
      company: "Boutaleb LLC d.b.a. BRENDT Shoes"
    },
    it: {
      title: "Utilizziamo i cookie",
      text: "Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. Continuando, accetti il nostro utilizzo dei cookie secondo la nostra politica sulla privacy.",
      accept: "Accetta",
      decline: "Rifiuta",
      manage: "Gestisci",
      company: "Boutaleb LLC d.b.a. BRENDT Shoes"
    },
    en: {
      title: "We use cookies",
      text: "We use cookies to enhance your experience on our site. By continuing, you agree to our use of cookies in accordance with our privacy policy.",
      accept: "Accept",
      decline: "Decline",
      manage: "Manage",
      company: "Boutaleb LLC d.b.a. BRENDT Shoes"
    }
  };

  useEffect(() => {
    const checkLocationAndConsent = async () => {
      // Check if user already gave consent
      if (typeof window !== 'undefined') {
        const existingConsent = localStorage.getItem('brendt-cookie-consent');
        if (existingConsent) {
          return; // Don't show banner if already consented
        }
      }

      try {
        // Get user's country using a free IP geolocation service
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Geolocation API failed');
        }
        const data = await response.json();
        const userCountry = data.country_code;

        // Check if user is in EU
        if (euCountries.includes(userCountry)) {
          setIsEU(true);
          
          // Set language based on country
          const countryLanguageMap = {
            'FR': 'fr', 'ES': 'es', 'DE': 'de', 'IT': 'it',
            'BE': 'fr', 'CH': 'de', 'AT': 'de'
          };
          
          const detectedLanguage = countryLanguageMap[userCountry] || 'en';
          setLanguage(detectedLanguage);
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback: show banner in English for safety (commented out to prevent showing unnecessarily)
        // setShowBanner(true);
        // setLanguage('en');
      }
    };

    checkLocationAndConsent();
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      // Store consent
      localStorage.setItem('brendt-cookie-consent', JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
        analytics: true,
        marketing: true
      }));
    }

    // Enable tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'grant');
    }
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'grant', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }

    setShowBanner(false);
  };

  const handleDecline = () => {
    if (typeof window !== 'undefined') {
      // Store declined consent
      localStorage.setItem('brendt-cookie-consent', JSON.stringify({
        accepted: false,
        timestamp: new Date().toISOString(),
        analytics: false,
        marketing: false
      }));
    }

    // Disable tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'revoke');
    }
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'deny', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }

    setShowBanner(false);
  };

  const handleManage = () => {
    if (typeof window !== 'undefined') {
      // For now, redirect to privacy policy
      window.open('/privacy-policy', '_blank');
    }
  };

  // Only render if should show banner and is EU
  if (!showBanner || !isEU) {
    return null;
  }

  const t = translations[language];

  return (
    <div className={styles.cookieConsent}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h3 className={styles.title}>{t.title}</h3>
          <p className={styles.text}>{t.text}</p>
          <div className={styles.company}>{t.company}</div>
        </div>
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${styles.buttonDecline}`}
            onClick={handleDecline}
          >
            {t.decline}
          </button>
          <button 
            className={`${styles.button} ${styles.buttonManage}`}
            onClick={handleManage}
          >
            {t.manage}
          </button>
          <button 
            className={`${styles.button} ${styles.buttonAccept}`}
            onClick={handleAccept}
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;