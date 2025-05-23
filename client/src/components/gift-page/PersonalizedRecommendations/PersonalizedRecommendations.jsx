import React, { forwardRef, useState, useEffect } from 'react';
import GiftFinder from './GiftFinder';
import styles from './PersonalizedRecommendations.module.css';

const PersonalizedRecommendations = forwardRef(({ onFilterChange }, ref) => {
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [previousAnswers, setPreviousAnswers] = useState(null);
  
  // Check for saved answers on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem('giftFinderAnswers');
    if (savedAnswers) {
      try {
        setPreviousAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error('Error parsing saved answers:', e);
      }
    }
  }, []);
  
  const openGiftFinder = () => {
    setIsFinderOpen(true);
  };
  
  const closeGiftFinder = () => {
    setIsFinderOpen(false);
  };
  
  const handleRecommendationComplete = (filters) => {
    // Update parent filters when recommendations are complete
    if (onFilterChange) {
      Object.entries(filters).forEach(([key, value]) => {
        onFilterChange(key, value);
      });
    }
    
    // Update local state with new answers
    if (filters) {
      setPreviousAnswers(filters);
    }
    
    setIsFinderOpen(false);
  };
  
  // Map relationship IDs to display text
  const getRelationshipText = (id) => {
    const relationshipMap = {
      'father': 'Père',
      'partner': 'Partenaire',
      'friend': 'Ami',
      'mentor': 'Mentor professionnel',
      'other': 'Autre relation'
    };
    return relationshipMap[id] || id;
  };
  
  // Map occasion IDs to display text
  const getOccasionText = (id) => {
    const occasionMap = {
      'anniversary': 'Anniversaire',
      'business': 'Réussite professionnelle',
      'celebration': 'Fêtes de fin d\'année',
      'thanks': 'Remerciement',
      'other': 'Autre occasion'
    };
    return occasionMap[id] || id;
  };
  
  // Map price range IDs to display text
  const getPriceRangeText = (id) => {
    const priceRangeMap = {
      'below200': 'Moins de 200€',
      '200to500': 'Entre 200€ et 500€',
      'above500': 'Plus de 500€'
    };
    return priceRangeMap[id] || id;
  };
  
  return (
    <section ref={ref} className={styles.recommendationsSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>Conseils Personnalisés</h2>
          <p>Laissez-nous vous guider vers le cadeau parfait</p>
        </div>
        
        {previousAnswers && (
          <div className={styles.previousAnswersContainer}>
            <h3>Vos Critères de Recherche</h3>
            <div className={styles.answersSummary}>
              {previousAnswers.relationship && previousAnswers.relationship !== 'all' && (
                <div className={styles.answerItem}>
                  <span className={styles.answerLabel}>Destinataire:</span>
                  <span className={styles.answerValue}>
                    {getRelationshipText(previousAnswers.relationship)}
                  </span>
                </div>
              )}
              
              {previousAnswers.occasion && previousAnswers.occasion !== 'all' && (
                <div className={styles.answerItem}>
                  <span className={styles.answerLabel}>Occasion:</span>
                  <span className={styles.answerValue}>
                    {getOccasionText(previousAnswers.occasion)}
                  </span>
                </div>
              )}
              
              {previousAnswers.priceRange && previousAnswers.priceRange !== 'all' && (
                <div className={styles.answerItem}>
                  <span className={styles.answerLabel}>Budget:</span>
                  <span className={styles.answerValue}>
                    {getPriceRangeText(previousAnswers.priceRange)}
                  </span>
                </div>
              )}
              
              {previousAnswers.contactInfo && (
                <div className={styles.answerItem}>
                  <span className={styles.answerLabel}>Contact:</span>
                  <span className={styles.answerValue}>
                    Un conseiller vous contactera bientôt
                  </span>
                </div>
              )}
            </div>
            
            <button 
              className={styles.modifyButton}
              onClick={openGiftFinder}
            >
              Modifier mes critères
            </button>
          </div>
        )}
        
        <div className={styles.consultationCard}>
          <div className={styles.consultationImage}>
            <div className={styles.imageOverlay}></div>
          </div>
          
          <div className={styles.consultationContent}>
            <h3>Découvrez le Cadeau Idéal</h3>
            <p>Notre service de conseil personnalisé vous aide à identifier le présent qui saura toucher son destinataire. Répondez à quelques questions pour que nous puissions vous guider vers la pièce qui correspondra parfaitement à vos attentes.</p>
            
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon} data-icon="personal"></div>
                <div className={styles.benefitText}>
                  <h4>Sélection Personnalisée</h4>
                  <p>Des recommandations adaptées à la personnalité du destinataire</p>
                </div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon} data-icon="occasion"></div>
                <div className={styles.benefitText}>
                  <h4>Adapté à l'Occasion</h4>
                  <p>Des suggestions parfaites pour chaque contexte</p>
                </div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon} data-icon="expert"></div>
                <div className={styles.benefitText}>
                  <h4>Expertise BRENDT</h4>
                  <p>Bénéficiez de notre savoir-faire en matière de cadeaux d'exception</p>
                </div>
              </div>
            </div>
            
            <button 
              className={styles.finderButton}
              onClick={openGiftFinder}
            >
              {previousAnswers ? 'Affiner Ma Sélection' : 'Démarrer la Consultation'}
            </button>
          </div>
        </div>
        
        {isFinderOpen && (
          <GiftFinder 
            onClose={closeGiftFinder}
            onComplete={handleRecommendationComplete}
          />
        )}
      </div>
    </section>
  );
});

PersonalizedRecommendations.displayName = 'PersonalizedRecommendations';

export default PersonalizedRecommendations;