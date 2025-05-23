'use client';

import React, { useEffect, useRef, useState } from 'react';
import GiftHeroSection from './GiftHeroSection/GiftHeroSection';
import GiftNavigation from './GiftNavigation/GiftNavigation';
import CuratedCollections from './CuratedCollections/CuratedCollections';
import SignatureGifts from './SignatureGifts/SignatureGifts';
import GiftOccasions from './GiftOccasions/GiftOccasions';
import PersonalizedRecommendations from './PersonalizedRecommendations/PersonalizedRecommendations';
import GiftingPhilosophy from './GiftingPhilosophy/GiftingPhilosophy';
import PresentationOptions from './PresentationOptions/PresentationOptions';
import styles from './GiftPage.module.css';
import '@/styles/gift-cursors.css';

export default function GiftPage() {
  const [activeFilter, setActiveFilter] = useState({
    occasion: 'all',
    relationship: 'all',
    priceRange: 'all',
    productType: 'all'
  });
  
  const sectionRefs = {
    hero: useRef(null),
    collections: useRef(null),
    signature: useRef(null),
    occasions: useRef(null),
    recommendations: useRef(null),
    philosophy: useRef(null),
    presentation: useRef(null)
  };
  
  // Add gift cursor treatment
  useEffect(() => {
    document.body.classList.add('gift-cursor-default');
    
    const handleMouseover = (e) => {
      // Products and interactive elements
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest(`.${styles.productCard}`)) {
        document.body.classList.add('gift-cursor-hover');
        document.body.classList.remove('gift-cursor-default');
      } else {
        document.body.classList.add('gift-cursor-default');
        document.body.classList.remove('gift-cursor-hover');
      }
    };
    
    document.addEventListener('mouseover', handleMouseover);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseover);
      document.body.classList.remove('gift-cursor-default');
      document.body.classList.remove('gift-cursor-hover');
    };
  }, []);
  
  // Scroll to section handler for navigation
  const scrollToSection = (sectionKey) => {
    if (sectionRefs[sectionKey]?.current) {
      const yOffset = -80; // Adjust for fixed header
      const element = sectionRefs[sectionKey].current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setActiveFilter(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  return (
    <div className={styles.giftPage} style={{ marginTop: "-30px" }}>
      <GiftHeroSection 
        ref={sectionRefs.hero} 
        onScrollToSection={scrollToSection}
      />
      
      <GiftNavigation 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange}
        onNavigate={scrollToSection}
      />
      
      <CuratedCollections 
        ref={sectionRefs.collections}
        filters={activeFilter} 
      />
      
      <SignatureGifts 
        ref={sectionRefs.signature}
        filters={activeFilter} 
      />
      
      <GiftOccasions 
        ref={sectionRefs.occasions}
        filters={activeFilter}
        onOccasionSelect={(occasion) => handleFilterChange('occasion', occasion)} 
      />
      
      <PersonalizedRecommendations 
        ref={sectionRefs.recommendations}
        onFilterChange={handleFilterChange} 
      />
      
      <GiftingPhilosophy ref={sectionRefs.philosophy} />
      
      <PresentationOptions ref={sectionRefs.presentation} />
    </div>
  );
}