import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './GiftProductCard.module.css';

export default function GiftProductCard({ product, presentation = 'default' }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  if (!product) return null;
  
  const {
    _id,
    id,
    name,
    price,
    images,
    category,
    subcategory,
    description
  } = product;
  
  const productId = _id || id;
  
  // Format price properly
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(price || 0);
  
  // Determine image to use (first image from array or placeholder)
  const imageSrc = imageError || !images || images.length === 0 
    ? '/assets/images/placeholder.png' 
    : images[0];
  
  // Different card layouts based on presentation type
  const cardClasses = `${styles.productCard} ${styles[presentation]}`;
  
  return (
    <Link href={`/products/${productId}`}>
      <div 
        className={cardClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.imageContainer}>
          <Image
            src={imageSrc}
            alt={name || 'Product'}
            width={400}
            height={500}
            className={styles.productImage}
            onError={() => setImageError(true)}
            priority={presentation === 'signature'}
          />
          
          {/* Decorative gift elements */}
          {presentation === 'signature' && (
            <div className={styles.giftElements}>
              <div className={`${styles.ribbon} ${isHovered ? styles.animated : ''}`}></div>
            </div>
          )}
        </div>
        
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{name || 'Produit'}</h3>
          
          {presentation === 'signature' && description && (
            <p className={styles.productDescription}>
              {description.substring(0, 120)}
              {description.length > 120 ? '...' : ''}
            </p>
          )}
          
          <div className={styles.productDetails}>
            <span className={styles.productCategory}>
              {category || 'Catégorie'} {subcategory ? `• ${subcategory}` : ''}
            </span>
            <span className={styles.productPrice}>{formattedPrice}</span>
          </div>
          
          {/* Gift intention - shown on hover */}
          {presentation === 'signature' && (
            <div className={`${styles.giftIntention} ${isHovered ? styles.visible : ''}`}>
              <p>L'expression parfaite d'une attention raffinée</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}