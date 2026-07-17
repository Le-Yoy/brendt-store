'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, productName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const galleryRef = useRef(null);
  
  // ✨ INTELLIGENT GESTURE DETECTION - Natural thresholds (20% slower)
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const gestureStateRef = useRef({
    isDetecting: false,
    direction: null,
    velocity: 0,
    startTime: 0,
    hasCommitted: false
  });
  
  // ✨ SMART CAROUSEL COMMUNICATION
  const [carouselState, setCarouselState] = useState({
    isActive: false,
    isCommitted: false
  });
  
  // Show the real images only — no padding with duplicates of the first image.
  // (Previously padded to 6 by repeating images[0], which made galleries with
  // few photos look duplicated.)
  const normalizedImages = images && images.length > 0
    ? images
    : ['/assets/images/placeholder.jpg'];
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // ✨ INTELLIGENT TOUCH START - Light Detection
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now
    };
    
    touchMoveRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    
    // Reset gesture state
    gestureStateRef.current = {
      isDetecting: true,
      direction: null,
      velocity: 0,
      startTime: now,
      hasCommitted: false
    };
    
    // Light carousel state - not blocking anything yet
    setCarouselState({
      isActive: true,
      isCommitted: false
    });
  };
  
  // ✨ SMART GESTURE DETECTION - 20% Slower Thresholds
  const onTouchMove = (e) => {
    if (!touchStartRef.current || !gestureStateRef.current.isDetecting) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const now = Date.now();
    const deltaTime = now - touchStartRef.current.time;
    
    // Calculate real-time velocity (pixels per ms)
    const currentVelocity = deltaTime > 0 ? absDeltaX / deltaTime : 0;
    gestureStateRef.current.velocity = currentVelocity;
    
    // Update current position
    touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
    
    // ✨ SLOWER DETECTION THRESHOLDS - 20% higher values for more deliberate gestures
    if (!gestureStateRef.current.direction && (absDeltaX > 15 || absDeltaY > 15)) {
      // Horizontal gesture criteria: SLOWER - more deliberate horizontal bias
      if (absDeltaX > absDeltaY * 2.6 && absDeltaX > 25) { // Was 2.2 and 18
        gestureStateRef.current.direction = 'horizontal';
        
        // ✨ SLOWER COMMITMENT CRITERIA - Higher thresholds for more intentional swipes
        const hasHighVelocity = currentVelocity > 0.5; // Was 0.4
        const hasSignificantDistance = absDeltaX > 45; // Was 35
        const hasHorizontalIntent = absDeltaX > absDeltaY * 3.5; // Was 3
        
        if (hasHighVelocity || hasSignificantDistance || hasHorizontalIntent) {
          gestureStateRef.current.hasCommitted = true;
          setCarouselState({
            isActive: true,
            isCommitted: true
          });
          // ✨ ONLY NOW prevent default - selective and intelligent
          e.preventDefault();
        }
      } 
      // Vertical gesture - immediately allow natural scrolling
      else if (absDeltaY > absDeltaX * 2.0 && absDeltaY > 18) { // Was 1.8 and 15
        gestureStateRef.current.direction = 'vertical';
        gestureStateRef.current.isDetecting = false;
        setCarouselState({
          isActive: false,
          isCommitted: false
        });
        // ✨ CRITICAL: Don't prevent - allow natural scroll
        return;
      }
    }
    
    // ✨ CONTINUE PREVENTION ONLY FOR COMMITTED HORIZONTAL GESTURES
    if (gestureStateRef.current.hasCommitted && gestureStateRef.current.direction === 'horizontal') {
      e.preventDefault();
    }
  };
  
  // ✨ INTELLIGENT GESTURE COMPLETION - Slower thresholds
  const onTouchEnd = (e) => {
    if (!touchStartRef.current || !touchMoveRef.current) {
      resetGestureState();
      return;
    }
    
    const deltaX = touchStartRef.current.x - touchMoveRef.current.x;
    const deltaY = Math.abs(touchStartRef.current.y - touchMoveRef.current.y);
    const swipeDistance = Math.abs(deltaX);
    const swipeTime = Date.now() - touchStartRef.current.time;
    const avgVelocity = gestureStateRef.current.velocity;
    
    // ✨ SLOWER SWIPE CRITERIA - 20% higher thresholds for more deliberate swipes
    const meetsDistanceThreshold = swipeDistance > 85; // Was 70
    const meetsVelocityThreshold = avgVelocity > 0.4; // Was 0.3
    const meetsTimeThreshold = swipeTime < 700; // Was 600
    const meetsVerticalLimit = deltaY < 70; // Was 60
    const wasCommitted = gestureStateRef.current.hasCommitted;
    const wasHorizontal = gestureStateRef.current.direction === 'horizontal';
    
    const isValidSwipe = wasCommitted && 
                        wasHorizontal && 
                        (meetsDistanceThreshold || meetsVelocityThreshold) &&
                        meetsTimeThreshold && 
                        meetsVerticalLimit;
    
    if (isValidSwipe) {
      e.preventDefault();
      
      // ✨ SMOOTH IMAGE TRANSITION
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
    
    // ✨ CLEAN RESET - No sticky states
    resetGestureState();
  };
  
  // ✨ CLEAN STATE RESET
  const resetGestureState = () => {
    setTimeout(() => {
      touchStartRef.current = null;
      touchMoveRef.current = null;
      gestureStateRef.current = {
        isDetecting: false,
        direction: null,
        velocity: 0,
        startTime: 0,
        hasCommitted: false
      };
      setCarouselState({
        isActive: false,
        isCommitted: false
      });
    }, 50);
  };
  
  // ✨ WISHLIST with gesture protection
  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Don't trigger during gestures
    if (gestureStateRef.current.isDetecting || gestureStateRef.current.hasCommitted) {
      return;
    }
    
    setWishlist(!wishlist);
    
    if (!wishlist) {
      console.log('Added to wishlist:', productName);
    } else {
      console.log('Removed from wishlist:', productName);
    }
  };
  
  // ✨ SMART CAROUSEL STATE COMMUNICATION
  useEffect(() => {
    const carouselEvent = new CustomEvent('carouselInteraction', {
      detail: { 
        isActive: carouselState.isActive,
        isCommitted: carouselState.isCommitted,
        direction: gestureStateRef.current.direction
      }
    });
    window.dispatchEvent(carouselEvent);
  }, [carouselState]);
  
  if (isMobile) {
    return (
      <div 
        className={styles.mobileGallery}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        data-carousel-active={carouselState.isActive}
        data-carousel-committed={carouselState.isCommitted}
      >
        <div 
          className={styles.mobileCarousel}
          style={{ 
            transform: `translateX(-${currentImageIndex * 100}%)`,
            transition: gestureStateRef.current.hasCommitted ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Was 0.4s
          }}
        >
          {normalizedImages.map((src, index) => (
            <div className={styles.mobileCarouselItem} key={`mobile-img-${index}`}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={src}
                  alt={`${productName} - Image ${index + 1}`}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index > 2 ? "lazy" : "eager"}
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
    <div className={styles.galleryContainer} ref={galleryRef}>
      <div className={styles.imageGrid}>
        {normalizedImages.map((src, index) => (
          <div 
            className={styles.imageCell}
            key={`desktop-img-${index}`}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={src}
                alt={`${productName} - Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 32.5vw"
                priority={index < 2}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index > 2 ? "lazy" : "eager"}
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
  );
}