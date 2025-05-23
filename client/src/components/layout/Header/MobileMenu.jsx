// src/components/layout/Header/MobileMenu.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { hommeCategories, femmeCategories } from './menuData';
import './MobileMenu.css';

const MobileMenu = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Animation sequence for menu items
  useEffect(() => {
    setAnimationComplete(true);
  }, []);

  // Toggle section (Homme/Femme)
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  // Toggle category
  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setActiveSubcategory(null);
  };

  // Toggle subcategory
  const toggleSubcategory = (subcategory) => {
    setActiveSubcategory(activeSubcategory === subcategory ? null : subcategory);
  };

  // Get the appropriate categories based on active section
  const getCategoriesForSection = (section) => {
    if (section === 'homme') {
      return hommeCategories;
    } else if (section === 'femme') {
      return femmeCategories;
    }
    return [];
  };

  // Render section categories
  const renderSectionCategories = (section) => {
    const categories = getCategoriesForSection(section);
    
    return (
      <ul className="mobile-menu__categories">
        {categories.map((category, idx) => (
          <li key={category.id} className="mobile-menu__category" style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}>
            <div className="mobile-menu__category-wrapper">
              <Link 
                href={`/category/${category.id}?gender=${section}`}
                className="mobile-menu__category-link"
                onClick={onClose}
              >
                {category.name}
              </Link>
              <button 
                className="mobile-menu__toggle-btn"
                onClick={() => toggleCategory(category.id)}
                aria-label={activeCategory === category.id ? "Cacher les sous-catégories" : "Afficher les sous-catégories"}
              >
                {activeCategory === category.id ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            {activeCategory === category.id && (
              <ul className="mobile-menu__subcategories">
                {category.subcategories.map((subcategory, subIdx) => (
                  <li key={subcategory.id} className="mobile-menu__subcategory" style={{ animationDelay: `${0.1 + (subIdx * 0.05)}s` }}>
                    <div className="mobile-menu__subcategory-wrapper">
                      <Link 
                        href={`/category/${category.id}?subcategory=${subcategory.id}&gender=${section}`}
                        className="mobile-menu__subcategory-link"
                        onClick={onClose}
                      >
                        {subcategory.name}
                      </Link>
                      {subcategory.items && subcategory.items.length > 0 && (
                        <button 
                          className="mobile-menu__toggle-btn mobile-menu__toggle-btn--small"
                          onClick={() => toggleSubcategory(subcategory.id)}
                          aria-label={activeSubcategory === subcategory.id ? "Cacher les produits" : "Afficher les produits"}
                        >
                          {activeSubcategory === subcategory.id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      )}
                    </div>
                    
                    {activeSubcategory === subcategory.id && subcategory.items && (
                      <ul className="mobile-menu__items">
                        {subcategory.items.map((item, itemIdx) => (
                          <li key={item.id} className="mobile-menu__item" style={{ animationDelay: `${0.1 + (itemIdx * 0.03)}s` }}>
                            <Link 
                              href={`/category/${category.id}?subcategory=${subcategory.id}&item=${item.id}&gender=${section}`}
                              className="mobile-menu__item-link"
                              onClick={onClose}
                            >
                              {item.name}
                              <FiChevronRight />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mobile-menu">
      <div className="mobile-menu__container">
        {/* Main sections */}
        <ul className="mobile-menu__sections">
          <li className={`mobile-menu__section ${animationComplete ? 'animate-in' : ''}`} style={{ animationDelay: '0.1s' }}>
            <button 
              className={`mobile-menu__section-btn ${activeSection === 'homme' ? 'mobile-menu__section-btn--active' : ''}`}
              onClick={() => toggleSection('homme')}
            >
              Homme
              {activeSection === 'homme' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {activeSection === 'homme' && renderSectionCategories('homme')}
          </li>
          
          <li className={`mobile-menu__section ${animationComplete ? 'animate-in' : ''}`} style={{ animationDelay: '0.15s' }}>
            <button 
              className={`mobile-menu__section-btn ${activeSection === 'femme' ? 'mobile-menu__section-btn--active' : ''}`}
              onClick={() => toggleSection('femme')}
            >
              Femme
              {activeSection === 'femme' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {activeSection === 'femme' && renderSectionCategories('femme')}
          </li>

          <li className={`mobile-menu__section ${animationComplete ? 'animate-in' : ''}`} style={{ animationDelay: '0.2s' }}>
            <button 
              className={`mobile-menu__section-btn ${activeSection === 'cadeaux' ? 'mobile-menu__section-btn--active' : ''}`}
              onClick={() => toggleSection('cadeaux')}
            >
              Cadeaux
              {activeSection === 'cadeaux' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {activeSection === 'cadeaux' && (
              <div className="mobile-menu__image-grid">
                <div className="mobile-menu__image-item">
                  <div className="mobile-menu__image-wrapper">
                    <img 
                      src="/assets/images/gift/cadeaux-pour-lui-2.webp" 
                      alt="Cadeau pour lui" 
                      className="mobile-menu__image"
                    />
                    <div className="mobile-menu__image-overlay">
                      <h3 className="mobile-menu__image-title">Cadeau pour lui</h3>
                      <Link href="/cadeaux-pour-lui" className="mobile-menu__image-btn" onClick={onClose}>
                        Découvrez maintenant
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mobile-menu__image-item">
                  <div className="mobile-menu__image-wrapper">
                    <img 
                      src="/assets/images/gift/cadeau-pour-elle-1.webp" 
                      alt="Cadeau pour elle" 
                      className="mobile-menu__image"
                    />
                    <div className="mobile-menu__image-overlay">
                      <h3 className="mobile-menu__image-title">Cadeau pour elle</h3>
                      <Link href="/cadeaux/femme" className="mobile-menu__image-btn" onClick={onClose}>
                       Découvrez maintenant
                     </Link>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </li>

         <li className={`mobile-menu__section ${animationComplete ? 'animate-in' : ''}`} style={{ animationDelay: '0.25s' }}>
           <Link href="/savoir-faire" className="mobile-menu__direct-link" onClick={onClose}>
             Savoir-Faire
           </Link>
         </li>

         <li className={`mobile-menu__section ${animationComplete ? 'animate-in' : ''}`} style={{ animationDelay: '0.3s' }}>
           <Link href="/textile-universe" className="mobile-menu__direct-link" onClick={onClose}>
             BRENDT Textile
           </Link>
         </li>
       </ul>

       {/* Footer navigation links */}
       <div className="mobile-menu__footer">
         <Link href="/compte" className="mobile-menu__footer-link" onClick={onClose}>
           Mon compte
         </Link>
         <Link href="/coups-de-coeur" className="mobile-menu__footer-link" onClick={onClose}>
           Mes coups de coeur
         </Link>
         <Link href="/contact" className="mobile-menu__footer-link" onClick={onClose}>
           Nous contacter
         </Link>
       </div>
     </div>
   </div>
 );
};

export default MobileMenu;