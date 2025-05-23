import React, { useState, useEffect } from 'react';
import styles from './GiftNavigation.module.css';

export default function GiftNavigation({ activeFilter, onFilterChange, onNavigate }) {
  const [isSticky, setIsSticky] = useState(false);
  const [activeTab, setActiveTab] = useState('occasion');
  
  // Categories for filtering
  const occasions = [
    { id: 'all', name: 'Toutes les occasions' },
    { id: 'anniversary', name: 'Anniversaire' },
    { id: 'business', name: 'Professionnel' },
    { id: 'celebration', name: 'Célébration' },
    { id: 'thanks', name: 'Remerciement' }
  ];
  
  const relationships = [
    { id: 'all', name: 'Toutes les relations' },
    { id: 'father', name: 'Père' },
    { id: 'partner', name: 'Partenaire' },
    { id: 'friend', name: 'Ami' },
    { id: 'mentor', name: 'Mentor' }
  ];
  
  const priceRanges = [
    { id: 'all', name: 'Tous les prix' },
    { id: 'below200', name: 'Moins de 200€' },
    { id: '200to500', name: '200€ - 500€' },
    { id: 'above500', name: 'Plus de 500€' }
  ];
  
  const productTypes = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'shoes', name: 'Chaussures' },
    { id: 'accessories', name: 'Accessoires' },
    { id: 'sets', name: 'Coffrets' }
  ];
  
  // Handle scroll events for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 90) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <nav className={`${styles.giftNavigation} ${isSticky ? styles.sticky : ''}`}>
      <div className={styles.contentContainer}>
        <div className={styles.navigationTabs}>
          <div 
            className={`${styles.tabItem} ${activeTab === 'occasion' ? styles.active : ''}`}
            onClick={() => handleTabChange('occasion')}
          >
            <span className={styles.tabIcon} data-icon="occasion"></span>
            <span className={styles.tabLabel}>Par Occasion</span>
          </div>
          
          <div 
            className={`${styles.tabItem} ${activeTab === 'relationship' ? styles.active : ''}`}
            onClick={() => handleTabChange('relationship')}
          >
            <span className={styles.tabIcon} data-icon="relationship"></span>
            <span className={styles.tabLabel}>Par Relation</span>
          </div>
          
          <div 
            className={`${styles.tabItem} ${activeTab === 'price' ? styles.active : ''}`}
            onClick={() => handleTabChange('price')}
          >
            <span className={styles.tabIcon} data-icon="price"></span>
            <span className={styles.tabLabel}>Par Budget</span>
          </div>
          
          <div 
            className={`${styles.tabItem} ${activeTab === 'product' ? styles.active : ''}`}
            onClick={() => handleTabChange('product')}
          >
            <span className={styles.tabIcon} data-icon="product"></span>
            <span className={styles.tabLabel}>Par Produit</span>
          </div>
        </div>
        
        <div className={styles.filterOptions}>
          {activeTab === 'occasion' && (
            <div className={styles.optionsRow}>
              {occasions.map(occasion => (
                <button 
                  key={occasion.id}
                  className={`${styles.filterButton} ${activeFilter.occasion === occasion.id ? styles.active : ''}`}
                  onClick={() => onFilterChange('occasion', occasion.id)}
                >
                  {occasion.name}
                </button>
              ))}
            </div>
          )}
          
          {activeTab === 'relationship' && (
            <div className={styles.optionsRow}>
              {relationships.map(relation => (
                <button 
                  key={relation.id}
                  className={`${styles.filterButton} ${activeFilter.relationship === relation.id ? styles.active : ''}`}
                  onClick={() => onFilterChange('relationship', relation.id)}
                >
                  {relation.name}
                </button>
              ))}
            </div>
          )}
          
          {activeTab === 'price' && (
            <div className={styles.optionsRow}>
              {priceRanges.map(range => (
                <button 
                  key={range.id}
                  className={`${styles.filterButton} ${activeFilter.priceRange === range.id ? styles.active : ''}`}
                  onClick={() => onFilterChange('priceRange', range.id)}
                >
                  {range.name}
                </button>
              ))}
            </div>
          )}
          
          {activeTab === 'product' && (
            <div className={styles.optionsRow}>
              {productTypes.map(type => (
                <button 
                  key={type.id}
                  className={`${styles.filterButton} ${activeFilter.productType === type.id ? styles.active : ''}`}
                  onClick={() => onFilterChange('productType', type.id)}
                >
                  {type.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.sectionLinks}>
          <button className={styles.sectionLink} onClick={() => onNavigate('collections')}>
            Collections
          </button>
          <button className={styles.sectionLink} onClick={() => onNavigate('signature')}>
            Nos Signatures
          </button>
          <button className={styles.sectionLink} onClick={() => onNavigate('occasions')}>
            Occasions
          </button>
          <button className={styles.sectionLink} onClick={() => onNavigate('recommendations')}>
            Conseils Personnalisés
          </button>
        </div>
      </div>
    </nav>
  );
}