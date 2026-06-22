'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './FeaturedProductCard.module.css';
import { useRegion } from '@/contexts/RegionContext';

const FeaturedProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { priceOf, formatProduct } = useRegion();
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
    isBestseller,
    isColorVariant,
    originalProductId,
    displayImage,
    selectedColor,
    displayColorIndex
  } = product;
  
  // Get images based on whether this is a color variant or not
  let defaultImage, secondImage;
  
  if (isColorVariant && selectedColor) {
    // Use the specific color variant images
    defaultImage = displayImage || selectedColor.images?.[0] || '/assets/images/placeholder.jpg';
    secondImage = selectedColor.images?.[1] || selectedColor.images?.[0] || '/assets/images/placeholder.jpg';
  } else {
    // Use the first color's images
    const defaultColor = colors[0] || {};
    defaultImage = defaultColor.images?.[0] || '/assets/images/placeholder.jpg';
    secondImage = defaultColor.images?.[1] || defaultColor.images?.[0] || '/assets/images/placeholder.jpg';
  }
  
  const displayImg = imageError 
    ? '/assets/images/placeholder.jpg' 
    : (hovered && secondImage ? secondImage : defaultImage);

  // Build product URL with proper color variant
  let productUrl = '';
  
  if (isColorVariant && originalProductId && selectedColor) {
    // Link to the exact color variant the user clicked on
    productUrl = `/products/${originalProductId}?color=${encodeURIComponent(selectedColor.name)}`;
    
    // If we also have the index, add it to make sure we get the right color
    if (displayColorIndex !== undefined) {
      productUrl += `&colorIndex=${displayColorIndex}`;
    }
  } else {
    productUrl = `/products/${_id}`;
  }

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
    window.location.href = productUrl;
  };

  const handleClick = (e) => {
    // Prevent click if touch interaction occurred
    if (hasMoved.current) {
      e.preventDefault();
      return false;
    }
  };

  // Display color name for color variants
  const displayName = isColorVariant && selectedColor ?
    `${name} - ${selectedColor.name}` : name;

  // Region-aware price display. MA keeps the exact original "{price} MAD" literal
  // (byte-identical); EU/US with a regional price set shows the formatted regional price.
  const priceDisplay = priceOf(product).currency !== 'MAD'
    ? formatProduct(product)
    : `${price} MAD`;
  
  return (
    <div className={styles.productCard}>
      <Link href={productUrl} className={styles.productLink}>
        <div 
          className={styles.linkContent}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
        >
          <div className={styles.imageContainer}>
            <Image
              src={displayImg}
              alt={displayName}
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
                <h3 className={styles.productName}>{displayName}</h3>
                <span className={styles.productPrice}>{priceDisplay}</span>
              </div>
            </div>
          </div>

          <div className={styles.productInfo}>
            <h3 className={styles.productName}>{displayName}</h3>
            <span className={styles.productPrice}>{priceDisplay}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedProductCard;