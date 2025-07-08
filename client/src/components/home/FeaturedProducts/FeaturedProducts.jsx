'use client';

import { useState, useEffect } from 'react';
import FeaturedProductGrid from './FeaturedProductGrid';
import productService from '@/services/productService';
import styles from './FeaturedProducts.module.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        
        // Get all products
        const result = await productService.getProducts({ limit: 200 });
        const fetchedProducts = result.data?.data || result.data || result || [];
        
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Helper function to expand products with color variants - ensures unique colors
  const expandProductsWithColorVariants = (products) => {
    if (!products || products.length === 0) return [];
    
    const expandedProducts = [];
    
    products.forEach(product => {
      if (product.colors && product.colors.length > 0) {
        // Create a separate "product" for each color variant
        product.colors.forEach((color, index) => {
          // Skip colors without images
          if (!color.images || color.images.length === 0) return;
          
          expandedProducts.push({
            ...product,
            _id: `${product._id}-color-${color.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
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

  // Helper function to get unique color variants (max 4)
  const getUniqueColorVariants = (products, maxCount = 4) => {
    const allVariants = expandProductsWithColorVariants(products);
    const uniqueVariants = [];
    const seenColors = new Set();
    
    for (const variant of allVariants) {
      const colorKey = variant.selectedColor ? 
        `${variant.originalProductId}-${variant.selectedColor.name}` : 
        variant._id;
      
      if (!seenColors.has(colorKey) && uniqueVariants.length < maxCount) {
        seenColors.add(colorKey);
        uniqueVariants.push(variant);
      }
    }
    
    return uniqueVariants;
  };

  // Find products by name
  const findProductsByNames = (names) => {
    return names.map(name => {
      return products.find(p => p.name === name);
    }).filter(Boolean);
  };

  // Collection 1: Penny Loafer variations
  const pennyLoaferProducts = findProductsByNames(['Penny Loafer']);
  const expandedPennyLoaferProducts = getUniqueColorVariants(pennyLoaferProducts, 4);
  
  // Collection 2: Babouches variations
  const babouchesProducts = findProductsByNames(['Babouches']);
  const expandedBabouchesProducts = getUniqueColorVariants(babouchesProducts, 4);

  return (
    <section className={styles.featuredProducts}>
      <div className={styles.container}>
        <div className={styles.divider}></div>
        <p className={styles.quote}>
          Une nouvelle collection de mocassins mettant en valeur l'excellence et le <em>savoir-faire</em> italien.
        </p>
        
        {/* Collection 1: Penny Loafer */}
        <div className={styles.collectionSection}>
          <h3 className={styles.collectionTitle}>Penny Loafer Collection</h3>
          <FeaturedProductGrid products={expandedPennyLoaferProducts} loading={loading} />
        </div>

        {/* Collection 2: Babouches Collection */}
        <div className={styles.collectionSection}>
          <h3 className={styles.collectionTitle}>Babouches Collection</h3>
          <FeaturedProductGrid products={expandedBabouchesProducts} loading={loading} />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;