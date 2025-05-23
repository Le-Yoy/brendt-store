// src/components/product/ProductGrid.jsx
import React from 'react';
import styles from './ProductGrid.module.css';
import Link from 'next/link';
import Image from 'next/image';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return <div className={styles.emptyGrid}>No products found</div>;
  }

  return (
    <div className={styles.productGrid}>
      {products.map(product => {
        // For variant products, use the variant-specific properties
        const productId = product.variantId || product.id;
        const productImage = product.mainImage || 
          (product.colors && product.colors[0] && product.colors[0].images && product.colors[0].images[0]) || 
          '/assets/images/placeholder.jpg';
        
        // Get product name - use display name if available (for variants), otherwise use original name
        const productName = product.displayName || product.name;
        
        // Format price with thousand separators and MAD currency
        const formatPrice = (price) => {
          if (!price && price !== 0) return '';
          return price.toLocaleString() + ' MAD';
        };

        return (
          <Link href={`/products/${productId}`} key={productId} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              <Image
                src={productImage}
                alt={productName}
                width={300}
                height={400}
                className={styles.productImage}
              />
              
              {product.isNewArrival && (
                <span className={styles.newBadge}>Nouveau</span>
              )}
              
              {product.discount && (
                <span className={styles.discountBadge}>-{product.discount}%</span>
              )}
            </div>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{productName}</h3>
              
              <div className={styles.priceContainer}>
                <span className={styles.price}>{formatPrice(product.price)}</span>
                
                {product.previousPrice && (
                  <span className={styles.previousPrice}>
                    {formatPrice(product.previousPrice)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;