import React, { useEffect, useRef } from 'react';
import styles from './GiftHeroSection.module.css';

export default function GiftHeroSection({ onScrollToSection }) {
  const heroRef = useRef(null);
  
  // Parallax effect implementation
  useEffect(() => {
    const handleScroll = () => {
        
        if (!heroRef.current) return;
        
        // Only apply parallax when the hero section is visible in viewport
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom < 0) return; // Skip if section is already scrolled past
        
        const scrollPosition = window.scrollY;
        const scrollRatio = Math.min(scrollPosition / window.innerHeight, 1); // Normalized 0-1 value
        
        const heroElement = heroRef.current;
        
        // Create parallax effect with more controlled movement
        const boxTop = heroElement.querySelector(`.${styles.giftBoxTop}`);
        const boxBase = heroElement.querySelector(`.${styles.giftBoxBase}`);
        const product = heroElement.querySelector(`.${styles.giftProduct}`);
        
        if (boxTop && boxBase && product) {
          // Use eased transitions for smoother effect
          const moveBox = 100 * scrollRatio; // Max 100px
          const moveTop = 200 * scrollRatio; // Max 200px 
          const moveProduct = 80 * scrollRatio; // Max 80px
          
          // Apply transforms
          boxBase.style.transform = `translateY(${moveBox}px)`;
          boxTop.style.transform = `translateY(${-moveTop}px) rotate(-5deg)`;
          product.style.transform = `translateY(${-moveProduct}px)`;
        }
      };
    
    // Use throttled scroll handler for performance
    const throttledHandler = throttle(handleScroll, 10);
    window.addEventListener('scroll', throttledHandler);
    
    // Return cleanup function with reset of transforms
    return () => {
      window.removeEventListener('scroll', throttledHandler);
      
      // Add this to reset transforms when component unmounts
      if (heroRef.current) {
        const boxTop = heroRef.current.querySelector(`.${styles.giftBoxTop}`);
        const boxBase = heroRef.current.querySelector(`.${styles.giftBoxBase}`);
        const product = heroRef.current.querySelector(`.${styles.giftProduct}`);
        
        if (boxTop) boxTop.style.transform = '';
        if (boxBase) boxBase.style.transform = '';
        if (product) product.style.transform = '';
      }
    };
  }, []);
  
  // Throttle function to improve scroll performance
  function throttle(callback, limit) {
    let waiting = false;
    return function() {
      if (!waiting) {
        callback.apply(this, arguments);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, limit);
      }
    };
  }

  // Handler for the CTA button click
  const handleDiscoverClick = () => {
    if (onScrollToSection) {
      onScrollToSection('signature');
    }
  };

  return (
    <section ref={heroRef} className={styles.heroSection}>
      <div className={styles.contentContainer}>
        <div className={styles.heroBackground}></div>
        
        <div className={styles.parallaxContainer}>
          <div className={styles.giftBoxBase}>
            <div className={styles.boxShadow}></div>
          </div>
          <div className={styles.giftProduct}></div>
          <div className={styles.giftBoxTop}></div>
          <div className={styles.giftRibbon}></div>
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>L'Art du Cadeau Parfait</h1>
          <p className={styles.heroSubtitle}>
            Découvrez l'expression ultime du raffinement à travers notre sélection de cadeaux d'exception,
            chacun porteur d'une attention qui transcende l'ordinaire.
          </p>
          <button 
            className={styles.heroCta}
            onClick={handleDiscoverClick}
          >
            Découvrir la Collection
          </button>
        </div>
      </div>
    </section>
  );
}