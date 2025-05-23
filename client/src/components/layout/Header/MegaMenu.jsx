// src/components/layout/Header/MegaMenu.jsx
import React, { useState, useEffect } from 'react';
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

  // Update active category when menu changes
  useEffect(() => {
    // Reset active category when menu changes based on current menu
    if (activeMegaMenu === 'homme') {
      setActiveCategory('chaussures');
    } else if (activeMegaMenu === 'femme') {
      setActiveCategory('chaussures');
    } else {
      setActiveCategory(null);
    }
  }, [activeMegaMenu]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log(`Fetching categories for all`);
        // Fetch all categories without gender filter to ensure we get everything
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
    // When menu changes, force a reload of products to ensure all are visible
    if (activeMegaMenu) {
      const fetchGenderProducts = async () => {
        try {
          // Ping the products endpoint to warm up cache for this gender's products
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
    // Always use the static category data which contains all subcategories
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
    
    // If not a valid category ID for current menu, don't update state
    const isValidCategory = menuCategories.some(cat => cat.id === categoryId);
    if (!isValidCategory) {
      console.warn(`Invalid category ID for ${activeMegaMenu}: ${categoryId}`);
      return;
    }
    
    // Update state with valid category
    setActiveCategory(categoryId);
  };

  // Get current category data
  const getCurrentCategory = () => {
    if (!activeCategory) return null;
    
    // Always use static data for gender-specific menus
    if (activeMegaMenu === 'homme') {
      return hommeCategories.find(cat => cat.id === activeCategory);
    } else if (activeMegaMenu === 'femme') {
      return femmeCategories.find(cat => cat.id === activeCategory);
    }
    
    // Fall back to API data for other menus
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
    
    // Use different logic based on gender menu
    if (activeMegaMenu === 'homme') {
      // For men's menu, we want to show all subcategories from static data
      if (category.id === 'chaussures') {
        return hommeCategories.find(cat => cat.id === 'chaussures')?.subcategories || [];
      }
      if (category.id === 'accessoires') {
        return hommeCategories.find(cat => cat.id === 'accessoires')?.subcategories || [];
      }
    } else if (activeMegaMenu === 'femme') {
      // For women's menu, we show the women's subcategories
      if (category.id === 'chaussures') {
        return femmeCategories.find(cat => cat.id === 'chaussures')?.subcategories || [];
      }
    }
    
    // Default to the provided category's subcategories
    return category.subcategories;
  };

  // Render the standard category grid used by both homme and femme menus
  const renderCategoryGrid = () => {
    // Filter subcategories for gender
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
        
        {/* Subcategories section - SIMPLIFIED */}
        <div className="mega-menu__subcategories">
          {currentCategory && (
            <>
              <h3 className="mega-menu__subcategory-title">
                {getSubcategoryTitle(currentCategory.id)}
              </h3>
              <ul className="mega-menu__subcategory-list">
                {filteredSubcategories.map((subcategory) => (
                  <li key={subcategory.id} className="mega-menu__subcategory-item">
                    <Link 
                      href={`/category/${currentCategory.id}?subcategory=${subcategory.id}&gender=${activeMegaMenu}`} 
                      className="mega-menu__subcategory-link"
                    >
                      {subcategory.name} {subcategory.count ? `(${subcategory.count})` : ''}
                    </Link>
                    {/* No individual product items displayed */}
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
                src={`/assets/images/placeholder.jpg`}
                alt={currentCategory.name || 'Category image'}
                width={300}
                height={400}
                className="mega-menu__featured-image"
              />
                <div className="mega-menu__featured-overlay">
                  <h4 className="mega-menu__featured-title">{currentCategory.name}</h4>
                </div>
              </div>
              {/* Standardized category URL with gender parameter */}
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