// src/components/layout/Header/MegaMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { hommeCategories, femmeCategories } from './menuData'; // Static data fallback
import productService from '@/services/productService';
import './MegaMenu.css';

const MegaMenu = ({ activeMegaMenu }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    activeMegaMenu === 'homme' ? 'chaussures' : 
    activeMegaMenu === 'femme' ? 'chaussures' : null
  );
  
  // New state for product management
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [subcategoryProducts, setSubcategoryProducts] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productCache, setProductCache] = useState({});
  
  const megaMenuTimeoutRef = useRef(null);

  // Update active category when menu changes
  useEffect(() => {
    if (activeMegaMenu === 'homme') {
      setActiveCategory('chaussures');
    } else if (activeMegaMenu === 'femme') {
      setActiveCategory('chaussures');
    } else {
      setActiveCategory(null);
    }
    
    // Clear expanded state when menu changes
    setExpandedSubcategory(null);
    setSubcategoryProducts({});
  }, [activeMegaMenu]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log(`Fetching categories for all`);
        const allCategoriesData = await productService.getCategories();
        console.log('All categories loaded:', allCategoriesData);
        setCategories(allCategoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        console.warn('Falling back to static category data');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to ensure all subcategories are visible
  useEffect(() => {
    if (activeMegaMenu) {
      const fetchGenderProducts = async () => {
        try {
          await productService.getProducts({ 
            gender: activeMegaMenu,
            limit: 100
          });
          console.log(`Preloaded ${activeMegaMenu} products`);
        } catch (err) {
          console.error('Error preloading products:', err);
        }
      };
      
      fetchGenderProducts();
    }
  }, [activeMegaMenu]);

  // Filter menu categories based on current menu
  const getMenuCategoriesForCurrentMenu = () => {
    if (activeMegaMenu === 'homme') {
      return hommeCategories;
    } else if (activeMegaMenu === 'femme') {
      return femmeCategories;
    } else {
      return [];
    }
  };

  const menuCategories = getMenuCategoriesForCurrentMenu();

  // Handle category hover
  const handleCategoryHover = (categoryId) => {
    console.log(`Hovering on category: ${categoryId}`);
    
    const isValidCategory = menuCategories.some(cat => cat.id === categoryId);
    if (!isValidCategory) {
      console.warn(`Invalid category ID for ${activeMegaMenu}: ${categoryId}`);
      return;
    }
    
    setActiveCategory(categoryId);
    // Clear expanded subcategory when changing category
    setExpandedSubcategory(null);
  };

  // NEW: Handle subcategory click to expand/collapse products
  const handleSubcategoryClick = async (e, subcategoryId) => {
    e.preventDefault();
    
    // If already expanded, collapse it
    if (expandedSubcategory === subcategoryId) {
      setExpandedSubcategory(null);
      return;
    }
    
    // Expand this subcategory
    setExpandedSubcategory(subcategoryId);
    
    // Fetch products if not already cached
    await fetchSubcategoryProducts(subcategoryId);
  };

  // NEW: Handle direct navigation to category page
  const handleViewAllClick = (subcategoryId) => {
    window.location.href = `/category/${activeCategory}?subcategory=${subcategoryId}&gender=${activeMegaMenu}`;
  };

  // NEW: Fetch products for a subcategory
  const fetchSubcategoryProducts = async (subcategoryId) => {
    const cacheKey = `${activeMegaMenu}-${activeCategory}-${subcategoryId}`;
    
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
      console.log(`Fetching products for ${activeMegaMenu} > ${activeCategory} > ${subcategoryId}`);
      
      const response = await productService.getProducts({
        category: activeCategory,
        subcategory: subcategoryId,
        gender: activeMegaMenu,
        limit: 5, // Max 5 products as requested
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

  // Get current category data
  const getCurrentCategory = () => {
    if (!activeCategory) return null;
    
    if (activeMegaMenu === 'homme') {
      return hommeCategories.find(cat => cat.id === activeCategory);
    } else if (activeMegaMenu === 'femme') {
      return femmeCategories.find(cat => cat.id === activeCategory);
    }
    
    const apiCategory = categories.find(cat => cat.category === activeCategory);
    if (apiCategory) {
      return {
        id: apiCategory.category,
        name: apiCategory.categoryName,
        subcategories: apiCategory.subcategories.map(sub => ({
          id: sub.subcategory,
          name: sub.subcategoryName,
          count: sub.count
        }))
      };
    }
    
    return null;
  };
  
  const currentCategory = getCurrentCategory();
  
  // Determine title for sub-categories section
  const getSubcategoryTitle = (categoryId) => {
    switch (categoryId) {
      case 'chaussures':
        return 'PAR FONCTIONNALITÉ';
      case 'accessoires':
        return 'PAR CATÉGORIE';
      default:
        return 'CATÉGORIES';
    }
  };

  // Render gift images for cadeaux section using local images
  const renderGiftImages = () => (
    <div className="mega-menu__image-collection">
      <div className="mega-menu__image-card">
        <div className="mega-menu__image-container">
          <img 
            src="/assets/images/gift/cadeaux-pour-lui-2.webp" 
            alt="Cadeau pour lui" 
            className="mega-menu__feature-image"
          />
          <div className="mega-menu__image-content">
            <h3 className="mega-menu__image-title">Cadeau pour lui</h3>
            <Link href="/cadeaux-pour-lui" className="mega-menu__image-btn">
              Découvrez maintenant
            </Link>
          </div>
        </div>
      </div>
      <div className="mega-menu__image-card">
        <div className="mega-menu__image-container">
          <img 
            src="/assets/images/gift/cadeau-pour-elle-1.webp" 
            alt="Cadeau pour elle" 
            className="mega-menu__feature-image"
          />
          <div className="mega-menu__image-content">
            <h3 className="mega-menu__image-title">Cadeau pour elle</h3>
            <Link href="/cadeaux/femme" className="mega-menu__image-btn">
              Découvrez maintenant
            </Link>
          </div>
        </div>
      </div>
      <div className="mega-menu__image-card">
        <div className="mega-menu__image-container">
          <img 
            src="/assets/images/gift/gift-guide-1.webp" 
            alt="Gift Guide" 
            className="mega-menu__feature-image"
          />
          <div className="mega-menu__image-content">
            <h3 className="mega-menu__image-title">Gift Guide</h3>
            <Link href="/cadeaux-pour-lui" className="mega-menu__image-btn">
              Découvrez maintenant
            </Link>
          </div>
        </div>
      </div>
      <div className="mega-menu__image-card">
        <div className="mega-menu__image-container">
          <img 
            src="/assets/images/gift/art-offrir-1.webp" 
            alt="L'art d'offrir" 
            className="mega-menu__feature-image"
          />
          <div className="mega-menu__image-content">
            <h3 className="mega-menu__image-title">L'art d'offrir</h3>
            <Link href="/cadeaux-pour-lui" className="mega-menu__image-btn">
              Découvrez maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Get subcategories for the current gender
  const getFilteredSubcategories = (category) => {
    if (!category || !category.subcategories) return [];
    
    if (activeMegaMenu === 'homme') {
      if (category.id === 'chaussures') {
        return hommeCategories.find(cat => cat.id === 'chaussures')?.subcategories || [];
      }
      if (category.id === 'accessoires') {
        return hommeCategories.find(cat => cat.id === 'accessoires')?.subcategories || [];
      }
    } else if (activeMegaMenu === 'femme') {
      if (category.id === 'chaussures') {
        return femmeCategories.find(cat => cat.id === 'chaussures')?.subcategories || [];
      }
    }
    
    return category.subcategories;
  };

  // NEW: Render individual products for a subcategory
  const renderSubcategoryProducts = (subcategoryId) => {
    const products = subcategoryProducts[subcategoryId] || [];
    
    if (loadingProducts && expandedSubcategory === subcategoryId) {
      return (
        <div className="mega-menu__products-loading">
          <div className="mega-menu__loading-spinner"></div>
          <span>Chargement des produits...</span>
        </div>
      );
    }

    if (products.length === 0 && expandedSubcategory === subcategoryId) {
      return (
        <div className="mega-menu__no-products">
          <span>Aucun produit disponible</span>
        </div>
      );
    }

    return (
      <div className="mega-menu__products-container">
        <div className="mega-menu__products-list">
          {products.map((product) => {
            const defaultColor = product.colors?.[0] || {};
            return (
              <Link
                key={product._id || product.id}
                href={`/products/${product._id || product.id}?color=${encodeURIComponent(defaultColor.name || 'default')}&colorIndex=0`}
                className="mega-menu__product-link"
              >
                <div className="mega-menu__product-item">
                  <div className="mega-menu__product-image">
                    {defaultColor.images?.[0] && (
                      <img
                        src={defaultColor.images[0]}
                        alt={product.name}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="mega-menu__product-info">
                    <span className="mega-menu__product-name">{product.name}</span>
                    <span className="mega-menu__product-price">{product.price} MAD</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <button
          onClick={() => handleViewAllClick(subcategoryId)}
          className="mega-menu__view-all-btn"
        >
          Voir tous les {subcategoryId}
        </button>
      </div>
    );
  };

  // Render the standard category grid used by both homme and femme menus
  const renderCategoryGrid = () => {
    const filteredSubcategories = currentCategory ? 
      getFilteredSubcategories(currentCategory) : [];
    
    return (
      <div className="mega-menu__grid">
        {/* Left column - Main categories */}
        <div className="mega-menu__categories">
          <ul className="mega-menu__category-list">
            {loading ? (
              <li className="mega-menu__category-item">Chargement...</li>
            ) : (
              menuCategories.map((category) => (
                <li 
                  key={category.id}
                  className={`mega-menu__category-item ${activeCategory === category.id ? 'mega-menu__category-item--active' : ''}`}
                  onMouseEnter={() => handleCategoryHover(category.id)}
                >
                  <span className="mega-menu__category-link">{category.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        
        {/* Divider */}
        <div className="mega-menu__divider"></div>
        
        {/* Subcategories section - ENHANCED with clickable products */}
        <div className="mega-menu__subcategories">
          {currentCategory && (
            <>
              <h3 className="mega-menu__subcategory-title">
                {getSubcategoryTitle(currentCategory.id)}
              </h3>
              <ul className="mega-menu__subcategory-list">
                {filteredSubcategories.map((subcategory) => (
                  <li 
                    key={subcategory.id} 
                    className={`mega-menu__subcategory-item ${expandedSubcategory === subcategory.id ? 'mega-menu__subcategory-item--expanded' : ''}`}
                  >
                    <div className="mega-menu__subcategory-header">
                      <button
                        onClick={(e) => handleSubcategoryClick(e, subcategory.id)}
                        className="mega-menu__subcategory-button"
                      >
                        <span className="mega-menu__subcategory-name">
                          {subcategory.name} {subcategory.count ? `(${subcategory.count})` : ''}
                        </span>
                        <span className={`mega-menu__expand-icon ${expandedSubcategory === subcategory.id ? 'mega-menu__expand-icon--expanded' : ''}`}>
                          +
                        </span>
                      </button>
                    </div>
                    
                    {/* NEW: Show products when subcategory is expanded */}
                    {expandedSubcategory === subcategory.id && (
                      <div className="mega-menu__subcategory-products">
                        {renderSubcategoryProducts(subcategory.id)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        
        {/* Featured image section */}
        <div className="mega-menu__featured">
          {currentCategory && (
            <div className="mega-menu__featured-content">
              <div className="mega-menu__featured-image-wrapper">
              <Image 
  src={`/assets/images/products/brendt-new/${activeMegaMenu === 'homme' ? 'Homme' : 'Femme'}/chaussures/${activeMegaMenu === 'homme' ? (currentCategory.id === 'chaussures' ? 'mocassins/Agafay-Walk/Gris/1.webp' : 'mocassins/Agafay-Walk/Gris/1.webp') : 'babouches/Beige/1.jpg'}`}
  alt={currentCategory.name || 'Category image'}
  width={300}
  height={400}
  className="mega-menu__featured-image"
/>
                <div className="mega-menu__featured-overlay">
                  <h4 className="mega-menu__featured-title">{currentCategory.name}</h4>
                </div>
              </div>
              <Link 
                href={`/category/${currentCategory.id}?gender=${activeMegaMenu}`}
                className="mega-menu__featured-link"
              >
                Découvrir la collection
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render different content based on active mega menu
  const renderMegaMenuContent = () => {
    switch (activeMegaMenu) {
      case 'homme':
        return renderCategoryGrid();
        
      case 'femme':
        return renderCategoryGrid();
        
      case 'cadeaux':
        return renderGiftImages();
        
      default:
        return null;
    }
  };

  return (
    <div className="mega-menu">
      <div className="container">
        {renderMegaMenuContent()}
      </div>
    </div>
  );
};

export default MegaMenu;