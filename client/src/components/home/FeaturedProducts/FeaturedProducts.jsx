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
        
        // Specific product IDs to display
        const featuredProductIds = [
          "67d607dc033ca42b418411f8",
          "67d607dc033ca42b41841209",
          "67d607dc033ca42b41841211",
          "67d607dc033ca42b418411de"
        ];
        
        // Get all products
        const result = await productService.getProducts({ limit: 200 });
        const fetchedProducts = result.data?.data || result.data || result || [];
        
        // Filter for the exact products by ID
        const selectedProducts = [];
        
        // Maintain the order of IDs as specified
        featuredProductIds.forEach(id => {
          const foundProduct = fetchedProducts.find(p => 
            (p._id || p.id) === id
          );
          if (foundProduct) {
            selectedProducts.push(foundProduct);
          }
        });
        
        // If we couldn't find all specific products, fall back to the first 4 available
        if (selectedProducts.length === 0) {
          setProducts(fetchedProducts.slice(0, 4));
        } else {
          setProducts(selectedProducts);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className={styles.featuredProducts}>
      <div className={styles.container}>
        <div className={styles.divider}></div>
        <p className={styles.quote}>
          Une nouvelle collection de mocassins mettant en valeur l'excellence et le <em>savoir-faire</em> italien.
        </p>
        <h2 className={styles.title}>Collections</h2>
        <FeaturedProductGrid products={products} loading={loading} />
      </div>
    </section>
  );
};

export default FeaturedProducts;