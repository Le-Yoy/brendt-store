// src/components/product/ProductGallery.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, productName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const galleryRef = useRef(null);
  
  // Ensure we have at least 6 images (duplicate if needed)
  const normalizedImages = images && images.length > 0 
    ? [...images, ...Array(Math.max(0, 6 - images.length)).fill(images[0])]
    : Array(6).fill('/assets/images/placeholder.jpg');
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on initial load
    checkIsMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Handle mobile carousel swipe
  const handleTouchStart = useRef({ x: 0 });
  
  const onTouchStart = (e) => {
    handleTouchStart.current.x = e.touches[0].clientX;
  };
  
  const onTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = handleTouchStart.current.x - touchEndX;
    
    // Detect swipe direction (threshold of 50px)
    if (diff > 50) {
      // Swipe left - show next image
      setCurrentImageIndex(prev => 
        prev < normalizedImages.length - 1 ? prev + 1 : 0
      );
    } else if (diff < -50) {
      // Swipe right - show previous image
      setCurrentImageIndex(prev => 
        prev > 0 ? prev - 1 : normalizedImages.length - 1
      );
    }
  };
  
  // Zoom image functionality - fixed to handle click events correctly
  const openZoom = (src) => {
    setZoomedImage(src);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when zoom is active
  };
  
  const closeZoom = () => {
    setZoomedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  // Wishlist functionality
  const toggleWishlist = (e) => {
    e.stopPropagation(); // Prevent triggering the zoom
    setWishlist(!wishlist);
    
    // Mock implementation of adding/removing from wishlist
    if (!wishlist) {
      console.log('Added to wishlist:', productName);
      // Here you would call an API to add to wishlist
    } else {
      console.log('Removed from wishlist:', productName);
      // Here you would call an API to remove from wishlist
    }
  };
  
  if (isMobile) {
    return (
      <div 
        className={styles.mobileGallery}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className={styles.mobileCarousel}
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {normalizedImages.map((src, index) => (
            <div className={styles.mobileCarouselItem} key={`mobile-img-${index}`}>
              <div className={styles.imageWrapper} onClick={() => openZoom(src)}>
                <Image 
                  src={src}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className={styles.productImage}
                />
                {index === 0 && (
                  <button 
                    className={styles.wishlistButton} 
                    onClick={toggleWishlist}
                    aria-label={wishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {wishlist ? 
                      <IoHeart className={styles.wishlistIcon} /> : 
                      <IoHeartOutline className={styles.wishlistIcon} />
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.mobileIndicator}>
          {normalizedImages.map((_, index) => (
            <button 
              key={`indicator-${index}`}
              className={`${styles.indicatorDot} ${index === currentImageIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className={styles.galleryContainer} ref={galleryRef}>
        <div className={styles.imageGrid}>
          {normalizedImages.map((src, index) => (
            <div 
              className={styles.imageCell}
              key={`desktop-img-${index}`}
            >
              <div 
                className={styles.imageWrapper}
                onClick={() => openZoom(src)}
              >
                <Image
                  src={src}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 32.5vw"
                  priority={index < 2}
                  className={styles.productImage}
                />
                {index === 0 && (
                  <button 
                    className={styles.wishlistButton} 
                    onClick={toggleWishlist}
                    aria-label={wishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {wishlist ? 
                      <IoHeart className={styles.wishlistIcon} /> : 
                      <IoHeartOutline className={styles.wishlistIcon} />
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Image zoom overlay */}
      {zoomedImage && (
        <div className={styles.zoomOverlay} onClick={closeZoom}>
          <div className={styles.zoomContent}>
            <button className={styles.closeZoom} onClick={closeZoom}>×</button>
            <div className={styles.zoomedImageContainer}>
              <Image
                src={zoomedImage}
                alt={productName}
                fill
                sizes="100vw"
                className={styles.zoomedImage}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}