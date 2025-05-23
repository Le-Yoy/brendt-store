import React, { forwardRef, useState } from 'react';
import CollectionCard from './CollectionCard';
import styles from './CuratedCollections.module.css';

const collections = [
    {
      id: 'business',
      title: "L'Homme d'Affaires",
      description: "Une sélection raffinée pour l'homme dont l'élégance est le reflet de l'ambition.",
      productIds: ['67d607dc033ca42b418411f6', '67d607dc033ca42b418411de'],
      image: '/assets/collections/businessman.webp'
    },
    {
      id: 'aesthete',
      title: "L'Esthète",
      description: "Des pièces d'exception pour celui qui apprécie la beauté jusque dans les moindres détails.",
      productIds: ['67d607dc033ca42b418411f8', '67d607dc033ca42b418411d8'],
      image: '/assets/collections/aesthete.webp'
    },
    {
      id: 'traveler',
      title: "Le Voyageur",
      description: "Des créations conjuguant élégance et praticité pour l'homme qui parcourt le monde.",
      productIds: ['67d607dc033ca42b4184121a', '67d607dc033ca42b41841211'],
      image: '/assets/collections/traveler.webp'
    }
  ];

const CuratedCollections = forwardRef(({ filters }, ref) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Filter collections if needed based on filters prop
  const filteredCollections = collections.filter(collection => {
    // Apply filtering logic if needed
    return true;
  });
  
  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft);
  };
  
  const scrollLeft = () => {
    const container = document.getElementById('collections-container');
    if (container) {
      container.scrollBy({
        left: -350,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    const container = document.getElementById('collections-container');
    if (container) {
      container.scrollBy({
        left: 350,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section ref={ref} className={styles.curatedCollectionsSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>Collections Curatées</h2>
          <p>Des assortiments pensés pour chaque personnalité</p>
        </div>
        
        <div className={styles.collectionsContainer}>
          <button 
            className={`${styles.scrollButton} ${styles.scrollLeft} ${scrollPosition <= 0 ? styles.hidden : ''}`}
            onClick={scrollLeft}
            aria-label="Voir les collections précédentes"
          >
            <span className={styles.scrollIcon}></span>
          </button>
          
          <div 
            id="collections-container"
            className={styles.collectionsScroll}
            onScroll={handleScroll}
          >
            {filteredCollections.map(collection => (
              <CollectionCard 
                key={collection.id} 
                collection={collection}
              />
            ))}
          </div>
          
          <button 
            className={`${styles.scrollButton} ${styles.scrollRight}`}
            onClick={scrollRight}
            aria-label="Voir les collections suivantes"
          >
            <span className={styles.scrollIcon}></span>
          </button>
        </div>
      </div>
    </section>
  );
});

CuratedCollections.displayName = 'CuratedCollections';

export default CuratedCollections;