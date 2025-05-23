import React, { forwardRef, useState } from 'react';
import OccasionCard from './OccasionCard';
import styles from './GiftOccasions.module.css';

const occasions = [
  {
    id: 'anniversary',
    title: 'Anniversaire',
    description: 'Célébrex un jour spécial avec une attention à la hauteur de lévénement.',
    image: '/assets/images/savoir/occasions/anniversary.webp',
    productIds: ['67d607dc033ca42b418411f8', '67d607dc033ca42b418411d8']
  },
  {
    id: 'business',
    title: 'Succès Professionnel',
    description: 'Marquez une étape importante dans une carrière avec un cadeau emblématique.',
    image: '/assets/images/savoir/occasions/business.webp',
    productIds: ['67d607dc033ca42b418411f6', '67d607dc033ca42b41841211']
  },
  {
    id: 'celebration',
    title: 'Fêtes de Fin dAnnée',
    description: 'Offrez lexcellence pour un moment festif et mémorable.',
    image: '/assets/images/savoir/occasions/celebration.webp',
    productIds: ['67d607dc033ca42b418411f8', '67d607dc033ca42b4184121a']
  },
  {
    id: 'thanks',
    title: 'Remerciement',
    description: 'Exprimez votre gratitude avec une attention qui témoigne de votre considération.',
    image: '/assets/images/savoir/occasions/thanks.webp',
    productIds: ['67d607dc033ca42b418411d8', '67d607dc033ca42b41841209']
  }
];

const GiftOccasions = forwardRef(({ filters, onOccasionSelect }, ref) => {
  const [activeOccasion, setActiveOccasion] = useState(null);
  
  // Apply filtering if needed
  const filteredOccasions = occasions.filter(occasion => {
    if (filters.relationship !== 'all') {
      // This would need a mapping of occasions to relationships
      // For now, we'll assume all occasions are valid for all relationships
      return true;
    }
    return true;
  });
  
  const handleOccasionClick = (occasionId) => {
    setActiveOccasion(occasionId);
    if (onOccasionSelect) {
      onOccasionSelect(occasionId);
    }
  };
  
  return (
    <section ref={ref} className={styles.giftOccasionsSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>Pour Chaque Occasion</h2>
          <p>Un cadeau adapté à chaque moment significatif</p>
        </div>
        
        <div className={styles.occasionsGrid}>
          {filteredOccasions.map(occasion => (
            <OccasionCard 
              key={occasion.id}
              occasion={occasion}
              isActive={activeOccasion === occasion.id}
              onClick={() => handleOccasionClick(occasion.id)}
            />
          ))}
        </div>
        
        <div className={styles.occasionQuote}>
          <blockquote>
            "Le temps vous est précieux, et celui que vous consacrez à choisir le cadeau parfait l'est tout autant."
          </blockquote>
        </div>
      </div>
    </section>
  );
});

GiftOccasions.displayName = 'GiftOccasions';

export default GiftOccasions;