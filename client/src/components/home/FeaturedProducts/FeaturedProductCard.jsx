'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './FeaturedProductCard.module.css';

const FeaturedProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);
  const hasMoved = useRef(false);
  
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

  // Enhanced touch handlers
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientY;
    touchEndRef.current = e.touches[0].clientY;
    hasMoved.current = false;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.touches[0].clientY;
    const moveDistance = Math.abs(touchEndRef.current - touchStartRef.current);
    
    if (moveDistance > 10) {
      hasMoved.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    // If user was scrolling, don't navigate
    if (hasMoved.current) {
      return;
    }
    
    // If it was a tap (no movement), navigate to product
    e.preventDefault();
    window.location.href = `/products/${_id}`;
  };

  const handleClick = (e) => {
    // Prevent click if touch interaction occurred
    if (hasMoved.current) {
      e.preventDefault();
      return false;
    }
  };
  
  return (
    <div className={styles.productCard}>
      <div 
        className={styles.productLink}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className={styles.imageContainer}>
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.productImage}
            priority={false}
            onError={() => setImageError(true)}
            draggable={false}
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
      </div>
    </div>
  );
};

export default FeaturedProductCard;