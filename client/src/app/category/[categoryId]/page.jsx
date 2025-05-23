'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import productService from '@/services/productService';
import ProductCard from '@/components/products/ProductCard';
import styles from './CategoryPage.module.css';

/**
 * CategoryPage component displays products filtered by category with sorting and filtering options
 * @param {Object} params - Contains route parameters including categoryId
 */
export default function CategoryPage({ params }) {
  // Use React.use to unwrap params
  const unwrappedParams = use(params);
  const categoryId = unwrappedParams?.categoryId || '';
  const router = useRouter();
  const searchParams = useSearchParams();
  const subcategoriesRef = useRef(null);
  
  // Get query parameters including gender
  const subcategory = searchParams.get('subcategory');
  const gender = searchParams.get('gender');

  // State management
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  
  // Filter and pagination state
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid', 'mixedA', 'mixedB'
  const productsPerPage = 12;

  // Function to get gender-specific preset tabs
  const getGenderFilterTabs = () => {
    // Always start with "TOUS"
    const baseTabs = [{ id: 'all', name: 'TOUS' }];
    
    if (gender === 'homme') {
      // Men's specific tabs
      return [
        ...baseTabs,
        { id: 'mocassins', name: 'MOCASSINS' },
        { id: 'boots', name: 'BOOTS' },
        { id: 'derbies', name: 'DERBIES' },
        { id: 'sneaker', name: 'SNEAKERS' }
      ];
    } else if (gender === 'femme') {
      // Women's specific tabs
      return [
        ...baseTabs,
        { id: 'babouches', name: 'BABOUCHES' },
        { id: 'mocassins', name: 'MOCASSINS' }
      ];
    }
    
    // Default: return tabs based on API data if no gender
    return baseTabs.concat(
      subcategories.map(sub => ({
        id: sub.subcategory,
        name: sub.subcategoryName.toUpperCase()
      }))
    );
  };

  // Helper function to expand products with color variants
  const expandProductsWithColorVariants = (products) => {
    if (!products || products.length === 0) return [];
    
    const expandedProducts = [];
    
    products.forEach(product => {
      if (product.colors && product.colors.length > 1) {
        // Create a separate "product" for each color variant
        product.colors.forEach((color, index) => {
          // Skip colors without images
          if (!color.images || color.images.length === 0) return;
          
          expandedProducts.push({
            ...product,
            _id: `${product._id}-color-${color.name.toLowerCase().replace(/\s+/g, '-')}-${index}`, // Add index to ensure uniqueness
            isColorVariant: true,
            originalProductId: product._id,
            displayImage: color.images[0],
            selectedColor: color,
            displayColorIndex: index
          });
        });
      } else {
        // Product has only one color or no colors, add as is
        expandedProducts.push(product);
      }
    });
    
    return expandedProducts;
  };

  // Horizontal scroll for subcategories - smoother version
  const scrollSubcategories = (direction) => {
    if (subcategoriesRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      const currentScroll = subcategoriesRef.current.scrollLeft;
      
      subcategoriesRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'auto' // Changed from smooth to prevent animation
      });
    }
  };
  
  // Fetch category and product data
  useEffect(() => {
    console.log(`Fetching products with gender: ${gender || 'none'}, category: ${categoryId}, subcategory: ${subcategory || 'all'}`);

    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // Fetch all categories without gender filter first
        const categoriesData = await productService.getCategories();
        
        // Find the matching category
        const matchingCategory = categoriesData.find(
          cat => cat.category === categoryId || cat.categoryName.toLowerCase() === categoryId.toLowerCase()
        );
        
        if (!matchingCategory) {
          setError('Category not found');
          setLoading(false);
          return;
        }
        
        setCategory(matchingCategory);
        setSubcategories(matchingCategory.subcategories || []);
        
        // Get subcategory from URL
        const subcategoryParam = searchParams.get('subcategory');
        
        if (subcategoryParam) {
          setSelectedSubcategory(subcategoryParam);
          // Fetch with the subcategory filter and gender
          await fetchProducts(matchingCategory.category, subcategoryParam, 'newest', 1);
        } else {
          // Fetch all products in category with gender filter
          await fetchProducts(matchingCategory.category, 'all', 'newest', 1);
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category data');
      }
      setLoading(false);
    };
    
    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId, searchParams]);

  // Fetch products with filters applied
  const fetchProducts = async (category, subcategory, sort, page) => {
    setLoading(true);
    try {
      const filters = {
        category,
        page,
        limit: productsPerPage,
        sort
      };
      
      // Only add subcategory filter if not 'all'
      if (subcategory && subcategory !== 'all') {
        filters.subcategory = subcategory;
      }
      
      // Add gender filter if available
      if (gender) {
        filters.gender = gender;
      }
      
      const response = await productService.getProducts(filters);
      
      setProducts(response.data || []);
      setTotalProducts(response.totalProducts || 0);
      setTotalPages(Math.ceil((response.totalProducts || 0) / productsPerPage));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategory) => {
    // Don't do anything if we're already on this subcategory
    if (selectedSubcategory === subcategory) {
      return;
    }
    
    // Remember the scroll position before changing
    const scrollPosition = subcategoriesRef.current ? subcategoriesRef.current.scrollLeft : 0;
    
    setSelectedSubcategory(subcategory);
    setCurrentPage(1); // Reset to first page
    
    if (category) {
      fetchProducts(category.category, subcategory, 'newest', 1);
    }
    
    // Update URL with subcategory parameter and preserve gender parameter
    const url = subcategory === 'all' 
      ? `/category/${categoryId}${gender ? `?gender=${gender}` : ''}` 
      : `/category/${categoryId}?subcategory=${subcategory}${gender ? `&gender=${gender}` : ''}`;
    
    window.history.replaceState({}, '', url);
    
    // Restore scroll position after state update
    setTimeout(() => {
      if (subcategoriesRef.current) {
        subcategoriesRef.current.scrollLeft = scrollPosition;
      }
    }, 10);
  };

  // Handle layout change
  const handleLayoutChange = (layout) => {
    setLayoutMode(layout);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page === currentPage) return;
    
    setCurrentPage(page);
    if (category) {
      fetchProducts(category.category, selectedSubcategory, 'newest', page);
    }
    
    // Scroll to top of products
    window.scrollTo({
      top: document.querySelector(`.${styles.categoryHeader}`).offsetTop,
      behavior: 'smooth'
    });
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <button 
        key="first" 
        className={`${styles.pageButton} ${currentPage === 1 ? styles.activePage : ''}`}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        aria-label="Go to first page"
      >
        1
      </button>
    );
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push(<span key="ellipsis1" className={styles.ellipsis}>...</span>);
    }
    
    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= totalPages && i > 1) {
        pages.push(
          <button 
            key={i} 
            className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
            onClick={() => handlePageChange(i)}
            aria-label={`Go to page ${i}`}
          >
            {i}
          </button>
        );
      }
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(<span key="ellipsis2" className={styles.ellipsis}>...</span>);
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <button 
          key="last" 
          className={`${styles.pageButton} ${currentPage === totalPages ? styles.activePage : ''}`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label={`Go to last page, page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }
    
    return (
      <div className={styles.pagination}>
        <button 
          className={styles.pageNavButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          «
        </button>
        {pages}
        <button 
          className={styles.pageNavButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          »
        </button>
      </div>
    );
  };

  // Render products based on selected layout
  const renderProductsLayout = () => {
    // Expand products to include color variants
    const expandedProducts = expandProductsWithColorVariants(products);
    
    if (!expandedProducts.length) {
      return (
        <div className={styles.noProducts}>
          <p>Aucun produit trouvé.</p>
        </div>
      );
    }

    // Only standard grid layout
    return (
      <div className={styles.productStandardGrid}>
        {expandedProducts.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            isFeatured={false}
          />
        ))}
      </div>
    );
  };

  // Show loading state
  if (loading && !products.length) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  // Show error state
  if (error && !products.length) {
    return (
      <div className={styles.errorContainer}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <Link href="/" className={styles.returnLink}>Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className={styles.categoryPage}>
      {/* Category header */}
      <div className={styles.categoryHeader}>
        <h1 className={styles.categoryTitle}>{category?.categoryName || 'COLLECTION'}</h1>
      </div>
      
      {/* Subcategories bar - UPDATED */}
      <div className={styles.subcategoriesBar}>
        <button 
          className={styles.scrollButton} 
          onClick={() => scrollSubcategories('left')}
          aria-label="Scroll categories left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <div className={styles.subcategoriesScroll} ref={subcategoriesRef}>
          {getGenderFilterTabs().map((tab) => (
            <button 
              key={tab.id}
              className={`${styles.subcategoryButton} ${selectedSubcategory === tab.id ? styles.active : ''}`}
              onClick={() => handleSubcategoryChange(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        
        <button 
          className={styles.scrollButton} 
          onClick={() => scrollSubcategories('right')}
          aria-label="Scroll categories right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Layout toggle - removed */}
      
      {/* Second divider */}
      <div className={styles.divider}></div>
      
      {/* Products container */}
      <div className={styles.productsContainer}>
        {/* Show loading indicator when refreshing products */}
        {loading && products.length > 0 ? (
          <div className={styles.loadingContainer} style={{ minHeight: 'auto', padding: '1rem 0' }}>
            <div className={styles.loader} style={{ width: '1.5rem', height: '1.5rem' }}></div>
          </div>
        ) : (
          renderProductsLayout()
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.paginationContainer}>
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
}