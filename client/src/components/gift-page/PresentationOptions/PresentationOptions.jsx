import React, { forwardRef, useState } from 'react';
import Image from 'next/image';
import styles from './PresentationOptions.module.css';

const presentationOptions = [
    {
      id: 'classic',
      title: 'Emballage Classique',
      description: 'Notre présentation signature, sobre et élégante.',
      details: 'Une boîte en papier texturé noir avec le logo BRENDT embossé en or, accompagnée d\'un ruban de soie et d\'une carte personnalisée.',
      included: ['Boîte luxe', 'Ruban de soie', 'Carte personnalisée', 'Pochon de protection'],
      image: '/assets/coffrets/emballage1.webp'
    },
    {
      id: 'premium',
      title: 'Coffret Premium',
      description: 'Une présentation exceptionnelle pour les occasions spéciales.',
      details: 'Un coffret en bois laqué avec finition haute brillance, doublé de suède, accompagné d\'accessoires d\'entretien et d\'une carte calligraphiée à la main.',
      included: ['Coffret en bois laqué', 'Intérieur en suède', 'Kit d\'entretien', 'Carte calligraphiée', 'Livraison spéciale'],
      image: '/assets/coffrets/coffretpremium10.webp'
    },
    {
      id: 'travel',
      title: 'Édition Voyage',
      description: 'Conçue pour le transport et la protection lors des déplacements.',
      details: 'Un coffret en cuir pleine fleur avec fermeture magnétique, compartiments internes et poignée intégrée, idéal pour les voyageurs exigeants.',
      included: ['Étui de voyage en cuir', 'Compartiments séparés', 'Poignée intégrée', 'Protection anti-humidité'],
      image: '/assets/coffrets/voyage01.webp'
    }
  ];
const additionalImages = {
    classic: ['/assets/coffrets/emballage1.webp'],
    premium: ['/assets/coffrets/coffretpremium10.webp'],
    travel: ['/assets/coffrets/voyage01.webp', '/assets/coffrets/voyage2.webp', '/assets/coffrets/voyage1.webp', '/assets/coffrets/voyage3.webp']
  };
const PresentationOptions = forwardRef((props, ref) => {
  const [activeOption, setActiveOption] = useState('classic');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleOptionChange = (optionId) => {
    setImageLoaded(false);
    setActiveOption(optionId);
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const activePresentation = presentationOptions.find(option => option.id === activeOption);
  // Add this to the component's state
  const [selectedImage, setSelectedImage] = useState({
    classic: '/assets/coffrets/emballage1.webp',
    premium: '/assets/coffrets/coffretpremium10.webp',
    travel: '/assets/coffrets/voyage01.webp'
  });
  
  // Add this function to handle thumbnail clicks
  const handleThumbnailClick = (imagePath) => {
    setImageLoaded(false);
    setSelectedImage({
      ...selectedImage,
      [activeOption]: imagePath
    });
  };
  // Additional images for gallery view
  const additionalImages = {
    classic: [],
    premium: [],
    travel: ['/assets/coffrets/voyage1.webp', '/assets/coffrets/voyage3.webp']
  };
  
  return (
    <section ref={ref} className={styles.presentationSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>L'Art de la Présentation</h2>
          <p>Car l'écrin participe à l'émotion du cadeau</p>
        </div>
        
        <div className={styles.presentationOptions}>
          <div className={styles.optionsTabs}>
            {presentationOptions.map(option => (
              <button 
                key={option.id}
                className={`${styles.optionTab} ${activeOption === option.id ? styles.active : ''}`}
                onClick={() => handleOptionChange(option.id)}
              >
                {option.title}
              </button>
            ))}
          </div>
          
          <div className={styles.optionDetails}>
            <div className={styles.optionVisual}>
              <div className={styles.mainImageContainer}>
                <div className={`${styles.imageLoader} ${imageLoaded ? styles.hidden : ''}`}>
                  <span>Chargement...</span>
                </div>
                <Image 
  src={selectedImage[activeOption]}
  alt={activePresentation.title}
  width={600}
  height={400}
  className={`${styles.optionImage} ${imageLoaded ? styles.visible : ''}`}
  onLoad={handleImageLoad}
  priority={activeOption === 'classic'}
/>
              </div>
              
              {additionalImages[activeOption].map((img, index) => (
  <div 
    key={index} 
    className={`${styles.thumbnailContainer} ${selectedImage[activeOption] === img ? styles.active : ''}`}
    onClick={() => handleThumbnailClick(img)}
  >
    <Image 
      src={img}
      alt={`${activePresentation.title} - Vue ${index + 2}`}
      width={120}
      height={80}
      className={styles.thumbnailImage}
    />
  </div>
))}
            </div>
            
            <div className={styles.optionInfo}>
              <h3>{activePresentation.title}</h3>
              <p className={styles.optionDescription}>{activePresentation.description}</p>
              <p className={styles.optionDetails}>{activePresentation.details}</p>
              
              <div className={styles.includedFeatures}>
                <h4>Comprend</h4>
                <ul className={styles.featuresList}>
                  {activePresentation.included.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <span className={styles.featureCheck}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.personalizeNote}>
                <p>
                  Toutes nos options de présentation peuvent être personnalisées selon vos souhaits. 
                  Pour des demandes spécifiques, contactez notre service client.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.presentationFooter}>
          <p>
            Chaque création BRENDT mérite un écrin à la hauteur de sa qualité. Notre équipe porte une attention particulière à chaque détail de la présentation, transformant l'instant du déballage en un moment mémorable.
          </p>
        </div>
      </div>
    </section>
  );
});

PresentationOptions.displayName = 'PresentationOptions';

export default PresentationOptions;