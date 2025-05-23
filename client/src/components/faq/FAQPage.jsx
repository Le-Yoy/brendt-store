'use client';

import React, { useState, useEffect, useRef } from 'react';
import CategoryList from './CategoryList';
import FAQContent from './FAQContent';
import faqData from './faqData';
import styles from './FAQPage.module.css';

const FAQPage = ({ initialCategory = '' }) => {
  const [activeCategory, setActiveCategory] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const mobileCategoryRefs = useRef({});
  const contentRef = useRef(null);

  useEffect(() => {
    // Check if mobile view
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    // Set initial active category from URL parameter or default to first category
    if (initialCategory) {
      const matchedCategory = faqData.find(
        cat => cat.id === initialCategory || 
               cat.title.toLowerCase().includes(initialCategory.toLowerCase())
      );
      
      if (matchedCategory) {
        setActiveCategory(matchedCategory.id);
        
        // Scroll to the category after a short delay to ensure rendering
        setTimeout(() => {
          if (isMobile && mobileCategoryRefs.current[matchedCategory.id]) {
            mobileCategoryRefs.current[matchedCategory.id].scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          } else if (contentRef.current) {
            contentRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 300);
      } else if (faqData.length > 0) {
        setActiveCategory(faqData[0].id);
      }
    } else if (faqData.length > 0 && !activeCategory) {
      setActiveCategory(faqData[0].id);
    }

    return () => window.removeEventListener('resize', checkIfMobile);
  }, [initialCategory]);

  const toggleCategory = (categoryId) => {
    const newActive = activeCategory === categoryId ? '' : categoryId;
    setActiveCategory(newActive);
    
    // Scroll to the category if it's being opened on mobile
    if (newActive && isMobile && mobileCategoryRefs.current[categoryId]) {
      setTimeout(() => {
        mobileCategoryRefs.current[categoryId].scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest' 
        });
      }, 100);
    }
  };

  return (
    <div className={styles.faqPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Fréquentes questions</h1>
        <p className={styles.subtitle}>
          Selectionnez votre tâche pour voir tout les FAQ associées.
        </p>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.content} ref={contentRef}>
        {isMobile ? (
          // Mobile layout - accordion style
          <div className={styles.mobileContent}>
            {faqData.map((category) => (
              <div 
                key={category.id} 
                className={styles.mobileCategory}
                ref={el => mobileCategoryRefs.current[category.id] = el}
              >
                <button
                  className={`${styles.mobileCategoryButton} ${
                    activeCategory === category.id ? styles.active : ''
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.title}
                  <span className={`${styles.plusIcon} ${
                    activeCategory === category.id ? styles.active : ''
                  }`}>
                    <span className={styles.plusIconInner}></span>
                  </span>
                </button>
                
                {activeCategory === category.id && (
                  <FAQContent 
                    category={category} 
                    isMobile={true} 
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          // Desktop layout - two columns
          <div className={styles.desktopContent}>
            <CategoryList 
              categories={faqData} 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
            />
            <div className={styles.faqContentWrapper}>
              <FAQContent 
                category={faqData.find(cat => cat.id === activeCategory)} 
                isMobile={false} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQPage;