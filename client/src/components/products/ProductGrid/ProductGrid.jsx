'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

/**
 * ProductGrid component displays a grid of products with responsive layout
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of product objects
 * @param {string} props.className - Additional CSS class
 * @param {boolean} props.loading - Loading state
 * @param {string} props.columns - Optional column configuration (default is responsive)
 */
const ProductGrid = ({ 
  products = [], 
  className = '',
  loading = false,
  columns = 'responsive' 
}) => {
  // State to track window width for responsive design
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If loading, show skeleton loading state
  if (loading) {
    return (
      <div className={`${styles.productGrid} ${className} ${styles[columns]}`}>
        {[...Array(4)].map((_, index) => (
          <div key={`skeleton-${index}`} className={styles.skeletonCard}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonPrice}></div>
          </div>
        ))}
      </div>
    );
  }
  
  // If no products and not loading, show empty state
  if (products.length === 0 && !loading) {
    return (
      <div className={styles.emptyState}>
        <p>Aucun produit trouvé</p>
      </div>
    );
  }
  
  return (
    <div className={`${styles.productGrid} ${className} ${styles[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;