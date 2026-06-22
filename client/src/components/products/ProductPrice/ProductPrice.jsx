// components/products/ProductPrice/ProductPrice.jsx
'use client';
import React from 'react';
import { useRegion } from '@/contexts/RegionContext';
import styles from './ProductPrice.module.css';

const ProductPrice = ({ product }) => {
  const { region, formatProduct, format } = useRegion();

  // Current price in the active currency (MAD fallback if EUR/USD not set).
  const current = formatProduct(product);

  // Compare-at / discount only shown in Morocco — we don't have regional
  // previous prices yet, so EU/US just shows the single current price.
  const showCompare = region === 'MA' && product.previousPrice;

  return (
    <div className={styles.priceContainer}>
      {showCompare ? (
        <>
          <div className={styles.prices}>
            <span className={styles.currentPrice}>{current}</span>
            <span className={styles.previousPrice}>{format(product.previousPrice)}</span>
          </div>
          <span className={styles.discount}>-{product.discount}%</span>
        </>
      ) : (
        <div className={styles.singlePrice}>
          <span className={styles.currentPrice}>{current}</span>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
