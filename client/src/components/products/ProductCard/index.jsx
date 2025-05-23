import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  // Get the main product image (first image of first color variant)
  const getMainImage = () => {
    if (product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0) {
      return product.colors[0].images[0];
    }
    return '/assets/images/placeholder.jpg';
  };

  // Handle price display (regular or discounted)
  const renderPrice = () => {
    if (product.previousPrice) {
      return (
        <div className={styles.priceContainer}>
          <span className={styles.discountedPrice}>{product.price} €</span>
          <span className={styles.previousPrice}>{product.previousPrice} €</span>
        </div>
      );
    }
    return <span className={styles.price}>{product.price} €</span>;
  };

  // Render color options as small circles
  const renderColorOptions = () => {
    if (!product.colors || product.colors.length <= 1) return null;
    
    return (
      <div className={styles.colorOptions}>
        {product.colors.slice(0, 4).map((color, index) => (
          <div 
            key={index}
            className={styles.colorOption}
            style={{ backgroundColor: color.code }}
            title={color.name}
          />
        ))}
        {product.colors.length > 4 && (
          <div className={styles.moreColors}>+{product.colors.length - 4}</div>
        )}
      </div>
    );
  };

  return (
    <Link href={`/products/${product._id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <Image
          src={getMainImage()}
          alt={product.name}
          width={400}
          height={500}
          className={styles.productImage}
        />
        {product.isNewArrival && <span className={styles.newBadge}>Nouveau</span>}
        {product.isBestseller && <span className={styles.bestsellerBadge}>Bestseller</span>}
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.categoryName}>{product.subcategoryName}</p>
        {renderPrice()}
        {renderColorOptions()}
      </div>
    </Link>
  );
};

export default ProductCard;