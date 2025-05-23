'use client';

import FeaturedProductCard from './FeaturedProductCard';
import styles from './FeaturedProductGrid.module.css';

const FeaturedProductGrid = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <div className={styles.productGrid}>
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
  
  if (products.length === 0 && !loading) {
    return <div className={styles.emptyState}>Aucun produit trouvé</div>;
  }
  
  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <FeaturedProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
};

export default FeaturedProductGrid;