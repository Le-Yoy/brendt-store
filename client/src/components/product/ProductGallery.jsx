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
  
  // Enhanced touch handling with stricter thresholds
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const touchMoveRef = useRef({ x: 0, y: 0 });
  const isSwipeInProgress = useRef(false);
  const swipeDirection = useRef(null); // 'horizontal', 'vertical', or null
  
  // Ensure we have at least 6 images (duplicate if needed)
  const normalizedImages = images && images.length > 0 
    ? [...images, ...Array(Math.max(0, 6 - images.length)).fill(images[0])]
    : Array(6).fill('/assets/images/placeholder.jpg');
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Perfect touch handlers for mobile carousel
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchMoveRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    isSwipeInProgress.current = false;
    swipeDirection.current = null;
  };
  
  const onTouchMove = (e) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    touchMoveRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Determine swipe direction only once with strict thresholds
    if (!swipeDirection.current && (deltaX > 15 || deltaY > 15)) {
      if (deltaX > deltaY && deltaX > 20) {
        // Clear horizontal swipe detected
        swipeDirection.current = 'horizontal';
        isSwipeInProgress.current = true;
        // Only prevent default for horizontal swipes
        e.preventDefault();
      } else if (deltaY > deltaX && deltaY > 15) {
        // Vertical scroll detected
        swipeDirection.current = 'vertical';
        isSwipeInProgress.current = false;
        // Allow natural scroll - don't prevent default
      }
    }
    
    // Continue preventing default only for horizontal swipes
    if (swipeDirection.current === 'horizontal') {
      e.preventDefault();
    }
  };
  
  const onTouchEnd = (e) => {
    if (!touchStartRef.current || !touchMoveRef.current) return;
    
    const deltaX = touchStartRef.current.x - touchMoveRef.current.x;
    const deltaY = Math.abs(touchStartRef.current.y - touchMoveRef.current.y);
    const swipeTime = Date.now() - touchStartRef.current.time;
    
    // STRICTER CRITERIA - Only process horizontal swipes with higher threshold
    if (swipeDirection.current === 'horizontal' && 
        Math.abs(deltaX) > 100 && 
        deltaY < 25 && 
        swipeTime < 350) {
      
      e.preventDefault();
      
      if (deltaX > 0) {
        // Swipe left - next image
        setCurrentImageIndex(prev => 
          prev < normalizedImages.length - 1 ? prev + 1 : 0
        );
      } else {
        // Swipe right - previous image  
        setCurrentImageIndex(prev => 
          prev > 0 ? prev - 1 : normalizedImages.length - 1
        );
      }
    }
    
    // Reset all touch tracking
    touchStartRef.current = null;
    touchMoveRef.current = null;
    isSwipeInProgress.current = false;
    swipeDirection.current = null;
  };
  
  // Zoom functionality with swipe protection
  const openZoom = (src, e) => {
    // Don't zoom if user was swiping
    if (isSwipeInProgress.current || swipeDirection.current === 'horizontal') {
      return;
    }
    
    if (e) e.preventDefault();
    setZoomedImage(src);
    document.body.style.overflow = 'hidden';
  };
  
  const closeZoom = () => {
    setZoomedImage(null);
    document.body.style.overflow = 'auto';
  };
  
  // Wishlist functionality
  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlist(!wishlist);
    
    if (!wishlist) {
      console.log('Added to wishlist:', productName);
    } else {
      console.log('Removed from wishlist:', productName);
    }
  };
  
  if (isMobile) {
    return (
      <div 
        className={styles.mobileGallery}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className={styles.mobileCarousel}
          style={{ 
            transform: `translateX(-${currentImageIndex * 100}%)`,
            transition: isSwipeInProgress.current ? 'none' : 'transform 0.25s ease-out'
          }}
        >
          {normalizedImages.map((src, index) => (
            <div className={styles.mobileCarouselItem} key={`mobile-img-${index}`}>
              <div 
                className={styles.imageWrapper} 
                onClick={(e) => openZoom(src, e)}
              >
                <Image 
                  src={src}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className={styles.productImage}
                  draggable={false}
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
                onClick={(e) => openZoom(src, e)}
              >
                <Image
                  src={src}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 32.5vw"
                  priority={index < 2}
                  className={styles.productImage}
                  draggable={false}
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
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}