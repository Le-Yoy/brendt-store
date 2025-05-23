'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './FeaturedProductCard.module.css';

const FeaturedProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  if (!product) return null;
  
  const {
    _id,
    name,
    price,
    colors = [],
    isNewArrival,
    isBestseller
  } = product;
  
  const defaultColor = colors[0] || {};
  const defaultImage = defaultColor.images?.[0] || '/assets/images/placeholder.jpg';
  const secondImage = defaultColor.images?.[1] || defaultColor.images?.[0] || '/assets/images/placeholder.jpg';
  
  const displayImage = imageError 
    ? '/assets/images/placeholder.jpg' 
    : (hovered && secondImage ? secondImage : defaultImage);
  
  return (
    <div className={styles.productCard}>
      <Link href={`/products/${_id}`} className={styles.productLink}>
        <div 
          className={styles.imageContainer}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.productImage}
            priority={false}
            onError={() => setImageError(true)}
          />
          
          {(isNewArrival || isBestseller) && (
            <div className={styles.labelsContainer}>
              {isNewArrival && <span className={styles.newLabel}>Nouveau</span>}
              {isBestseller && <span className={styles.bestsellerLabel}>Bestseller</span>}
            </div>
          )}
          
          <div className={styles.hoverInfo}>
            <div className={styles.infoBox}>
              <h3 className={styles.productName}>{name}</h3>
              <span className={styles.productPrice}>{price} €</span>
            </div>
          </div>
        </div>
        
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{name}</h3>
          <span className={styles.productPrice}>{price} €</span>
        </div>
        
        {/* Removed color variants as requested */}
      </Link>
    </div>
  );
};

export default FeaturedProductCard;