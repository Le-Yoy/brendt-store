import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import productService from '@/services/productService';
import styles from './OccasionCard.module.css';

export default function OccasionCard({ occasion, isActive, onClick }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!occasion.productIds || occasion.productIds.length === 0) {
        setFeaturedProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch featured products for this occasion
        const productPromises = occasion.productIds.map(id => 
          productService.getProduct(id)
            .then(res => {
              return res.data?.data || res.data || res;
            })
            .catch(e => {
              console.error(`Failed to fetch product ${id}:`, e);
              return null;
            })
        );
        
        const products = await Promise.all(productPromises);
        setFeaturedProducts(products.filter(p => p !== null));
      } catch (err) {
        console.error('Error fetching occasion products:', err);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [occasion.productIds]);
  
  const cardClasses = `${styles.occasionCard} ${isActive ? styles.active : ''}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      <div className={styles.occasionImageContainer}>
        <Image 
          src={occasion.image} 
          alt={occasion.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className={styles.occasionImage}
        />
        <div className={styles.imageOverlay}></div>
      </div>
      
      <div className={styles.occasionContent}>
        <h3 className={styles.occasionTitle}>{occasion.title}</h3>
        <p className={styles.occasionDescription}>{occasion.description}</p>
        
        {!loading && featuredProducts.length > 0 && (
          <div className={styles.featuredProducts}>
            <div className={styles.featuredLabel}>Suggestions</div>
            <div className={styles.productsGrid}>
              {featuredProducts.slice(0, 2).map(product => (
                <Link 
                  key={product._id || product.id} 
                  href={`/products/${product._id || product.id}`}
                  className={styles.productLink}
                >
                  <div className={styles.productThumbnail}>
                    <Image 
                      src={product.images?.[0] || '/assets/images/placeholder.png'}
                      alt={product.name}
                      width={60}
                      height={60}
                      className={styles.productImage}
                    />
                    <div className={styles.productName}>{product.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className={styles.occasionCta}>
          <Link href={`/collections/occasions/${occasion.id}`} className={styles.occasionLink}>
            Explorer la collection
          </Link>
        </div>
      </div>
    </div>
  );
}