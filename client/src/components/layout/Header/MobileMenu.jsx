// src/components/layout/Header/MobileMenu.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { hommeCategories, femmeCategories } from './menuData';
import productService from '@/services/productService';
import './MobileMenu.css';

const MobileMenu = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // NEW: Product management state
  const [subcategoryProducts, setSubcategoryProducts] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productCache, setProductCache] = useState({});
  
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

  // NEW: Enhanced toggle subcategory with product fetching
  const toggleSubcategory = async (subcategory) => {
    const newActiveSubcategory = activeSubcategory === subcategory ? null : subcategory;
    setActiveSubcategory(newActiveSubcategory);
    
    // Fetch products if expanding subcategory
    if (newActiveSubcategory && activeSection && activeCategory) {
      await fetchSubcategoryProducts(newActiveSubcategory);
    }
  };

  // NEW: Fetch products for a subcategory
  const fetchSubcategoryProducts = async (subcategoryId) => {
    const cacheKey = `${activeSection}-${activeCategory}-${subcategoryId}`;
    
    // Check cache first (5 minutes expiry)
    if (productCache[cacheKey] && Date.now() - productCache[cacheKey].timestamp < 300000) {
      console.log(`Using cached products for ${cacheKey}`);
      setSubcategoryProducts(prev => ({
        ...prev,
        [subcategoryId]: productCache[cacheKey].data
      }));
      return;
    }

    try {
      setLoadingProducts(true);
      console.log(`Fetching products for ${activeSection} > ${activeCategory} > ${subcategoryId}`);
      
      const response = await productService.getProducts({
        category: activeCategory,
        subcategory: subcategoryId,
        gender: activeSection,
        limit: 5, // Max 5 products for mobile
        sort: 'newest'
      });

      const products = response.data?.data || response.data || response || [];
      
      // Filter only in-stock products
      const inStockProducts = products.filter(product => 
        product.inStock === true || product.inStock === undefined
      );

      // Take only first 5 in-stock products
      const limitedProducts = inStockProducts.slice(0, 5);

      console.log(`Found ${limitedProducts.length} in-stock products for ${subcategoryId}`);

      // Update state
      setSubcategoryProducts(prev => ({
        ...prev,
        [subcategoryId]: limitedProducts
      }));

      // Cache the results
      setProductCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: limitedProducts,
          timestamp: Date.now()
        }
      }));

    } catch (error) {
      console.error(`Error fetching products for ${subcategoryId}:`, error);
      setSubcategoryProducts(prev => ({
        ...prev,
        [subcategoryId]: []
      }));
    } finally {
      setLoadingProducts(false);
    }
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

  // NEW: Render products for mobile
  const renderMobileProducts = (subcategoryId) => {
    const products = subcategoryProducts[subcategoryId] || [];
    
    if (loadingProducts && activeSubcategory === subcategoryId) {
      return (
        <div className="mobile-menu__products-loading">
          <span>Chargement...</span>
        </div>
      );
    }

    if (products.length === 0 && activeSubcategory === subcategoryId) {
      return null;
    }

    return (
      <ul className="mobile-menu__products">
        {products.map((product) => {
          const defaultColor = product.colors?.[0] || {};
          return (
            <li key={product._id || product.id} className="mobile-menu__product">
              <Link
                href={`/products/${product._id || product.id}?color=${encodeURIComponent(defaultColor.name || 'default')}&colorIndex=0`}
                className="mobile-menu__product-link"
                onClick={onClose}
              >
                <div className="mobile-menu__product-image">
                  {defaultColor.images?.[0] && (
                    <img
                      src={defaultColor.images[0]}
                      alt={product.name}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="mobile-menu__product-info">
                  <span className="mobile-menu__product-name">{product.name}</span>
                  <span className="mobile-menu__product-price">{product.price} MAD</span>
                </div>
                <FiChevronRight className="mobile-menu__product-arrow" />
              </Link>
            </li>
          );
        })}
        <li className="mobile-menu__view-all">
          <Link
            href={`/category/${activeCategory}?subcategory=${subcategoryId}&gender=${activeSection}`}
            className="mobile-menu__view-all-link"
            onClick={onClose}
          >
            Voir tous les {subcategoryId}
          </Link>
        </li>
      </ul>
    );
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
                      <button 
                        className="mobile-menu__toggle-btn mobile-menu__toggle-btn--small"
                        onClick={() => toggleSubcategory(subcategory.id)}
                        aria-label={activeSubcategory === subcategory.id ? "Cacher les produits" : "Afficher les produits"}
                      >
                        {activeSubcategory === subcategory.id ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                    
                    {/* NEW: Show products when subcategory is expanded */}
                    {activeSubcategory === subcategory.id && (
                      <div className="mobile-menu__products-container">
                        {renderMobileProducts(subcategory.id)}
                      </div>
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