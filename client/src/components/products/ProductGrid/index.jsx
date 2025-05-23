import React from 'react';
import ProductCard from '../ProductCard';
import styles from './ProductGrid.module.css';

const ProductGrid = ({ products }) => {
  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;