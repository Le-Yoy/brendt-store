'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';

/**
 * ProductCard component displays a product in a grid
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {boolean} props.isFeatured - Whether this is a featured product (for layout styling)
 */
const ProductCard = ({ product, isFeatured = false }) => {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  if (!product) return null;
  
  const {
    _id,
    name,
    price,
    description,
    category,
    colors = [],
    isNewArrival,
    isBestseller,
    isColorVariant,
    originalProductId,
    displayImage,
    selectedColor,
    displayColorIndex,
    inStock = true
  } = product;
  
  // Get the first color variant and its first image
  const defaultColor = colors[0] || {};
  
  // Use displayImage if it exists (for color variants), otherwise use default
  const mainImage = displayImage || 
    (defaultColor.images && defaultColor.images[0]) || 
    '/assets/images/placeholder.jpg';
  
  // For hover effect, try to get a second image if it exists
  let secondImage = mainImage;
  
  if (isColorVariant && selectedColor && selectedColor.images && selectedColor.images.length > 1) {
    secondImage = selectedColor.images[1];
  } else if (defaultColor.images && defaultColor.images.length > 1) {
    secondImage = defaultColor.images[1];
  }
  
  // Display image based on hover state and error state
  const displayImg = imageError 
    ? '/assets/images/placeholder.jpg' 
    : (hovered && secondImage ? secondImage : mainImage);
  
  // Build product URL with proper color variant
  let productUrl = '';
  
  if (isColorVariant && originalProductId) {
    // Ensure we link to the exact color variant the user clicked on
    productUrl = `/products/${originalProductId}?color=${encodeURIComponent(selectedColor.name)}`;
    
    // If we also have the index, add it to make sure we get the right color
    if (displayColorIndex !== undefined) {
      productUrl += `&colorIndex=${displayColorIndex}`;
    }
  } else {
    productUrl = `/products/${_id}`;
  }

  // Editorial text treatment for featured products
  const getCategoryDisplay = () => {
    if (category) {
      return typeof category === 'string' 
        ? category.toUpperCase() 
        : (category.categoryName || '').toUpperCase();
    }
    return '';
  };
  
  // Check if any colors are available
  const hasAvailableColors = colors.some(color => color.inStock !== false);
  
  // Prevent click when out of stock or no colors available
  const handleClick = (e) => {
    if (!inStock || !hasAvailableColors) {
      e.preventDefault();
    }
  };
  
  // Format price in MAD
  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return `${price.toLocaleString()} MAD`;
  };
  
  // Get effective price for display (main product price, or range if variants have different prices)
  const getDisplayPrice = () => {
    // Filter available colors only
    const availableColors = colors.filter(color => color.inStock !== false);
    
    if (availableColors.length > 1) {
      // Check if any available color has a custom price
      const customPrices = availableColors.filter(color => color.price !== undefined);
      
      if (customPrices.length > 0) {
        // Get all available prices (variant prices + main price for colors without custom price)
        const allPrices = availableColors.map(color => color.price !== undefined ? color.price : price);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);
        
        if (minPrice === maxPrice) {
          return formatPrice(minPrice);
        } else {
          return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
        }
      }
    }
    
    // Default: use main product price
    return formatPrice(price);
  };
  
  // Determine overall stock status (product + colors)
  const isProductAvailable = inStock && hasAvailableColors;
  
  return (
    <div className={`${styles.productCard} ${isFeatured ? styles.featuredCard : ''} ${!isProductAvailable ? styles.outOfStock : ''}`}>
      <Link href={productUrl} className={styles.productLink} onClick={handleClick}>
        <div 
          className={styles.imageContainer}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Product image with error handling */}
          <Image
            src={displayImg}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.productImage}
            priority={false}
            onError={(e) => {
              console.warn(`Image failed to load: ${displayImg}`);
              setImageError(true);
              e.target.src = '/assets/images/placeholder.jpg';
            }}
          />
          
          {/* Out of stock overlay */}
          {!isProductAvailable && (
            <div className={styles.outOfStockOverlay}>
              <span className={styles.outOfStockText}>
                {!inStock ? 'Rupture de stock' : 'Couleurs indisponibles'}
              </span>
            </div>
          )}
          
          {/* Product labels */}
          {(isNewArrival || isBestseller) && isProductAvailable && (
            <div className={styles.labelsContainer}>
              {isNewArrival && <span className={styles.newLabel}>Nouveau</span>}
              {isBestseller && <span className={styles.bestsellerLabel}>Bestseller</span>}
            </div>
          )}
          
          {/* Category tag for editorial styling */}
          {isFeatured && (
            <div className={styles.categoryTag}>
              {getCategoryDisplay()}
            </div>
          )}
        </div>
        
        {/* Product info */}
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{name}</h3>
          
          {/* Description for featured products */}
          {isFeatured && description && (
            <p className={styles.productDescription}>{description}</p>
          )}
          
          {/* Show color name for color variants */}
          {isColorVariant && selectedColor && (
            <div className={styles.colorName}>{selectedColor.name}</div>
          )}
          
          <span className={styles.productPrice}>{getDisplayPrice()}</span>
          
          {/* Out of stock notice */}
          {!isProductAvailable && (
            <div className={styles.outOfStockNotice}>
              {!inStock ? 'Rupture de stock' : 'Couleurs indisponibles'}
            </div>
          )}
        </div>
        
        {/* Color variants - only show available colors for non-variant products */}
        {!isColorVariant && colors.length > 1 && isProductAvailable && (
          <div className={styles.colorVariants}>
            {colors.filter(color => color.inStock !== false).map((color, index) => (
              <div
                key={`${color.name || color}-${index}`}
                className={styles.colorSwatch}
                style={{ 
                  backgroundColor: color.code || 
                    getColorHexCode(typeof color === 'string' ? color : color.name) 
                }}
                title={typeof color === 'string' ? color : color.name}
              />
            ))}
          </div>
        )}
        
        {/* Quick view button that appears on hover - only if available */}
        {isProductAvailable && (
          <div className={styles.quickViewButton}>
            Aperçu rapide
          </div>
        )}
      </Link>
    </div>
  );
};

// Helper function to get hex codes for common color names
function getColorHexCode(colorName) {
  const colorMap = {
    'Noir': '#000000',
    'Marron': '#5D4037',
    'Cognac': '#BF8950',
    'Bordeaux': '#8E2335',
    'Brun': '#6D4C41',
    'Tan': '#D2B48C',
    'Chocolate': '#7B3F00',
    'Camel': '#C4A484',
    'Navy': '#000080',
    'Gris': '#9E9E9E',
    'Beige': '#F5F5DC',
    'Blanc': '#FFFFFF',
    // Add more colors as needed
  };
  
  // Default to a neutral tone if color not found
  return colorMap[colorName] || '#A0A0A0';
}

export default ProductCard;