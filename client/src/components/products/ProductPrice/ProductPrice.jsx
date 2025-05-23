// components/products/ProductPrice/ProductPrice.jsx
import React from 'react';
import styles from './ProductPrice.module.css';

const ProductPrice = ({ product }) => {
  const formatPrice = (price) => {
    if (!price) return '';
    return price.toLocaleString() + ' MAD';
  };

  return (
    <div className={styles.priceContainer}>
      {product.previousPrice ? (
        <>
          <div className={styles.prices}>
            <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
            <span className={styles.previousPrice}>{formatPrice(product.previousPrice)}</span>
          </div>
          <span className={styles.discount}>-{product.discount}%</span>
        </>
      ) : (
        <div className={styles.singlePrice}>
          <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;