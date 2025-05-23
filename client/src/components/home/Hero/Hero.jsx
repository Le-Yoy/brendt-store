import { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import Button from '../../common/Button/Button';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  
  const images = [
    '/assets/images/trioimages/1.png',
    '/assets/images/trioimages/2.png',
    '/assets/images/trioimages/3.png',
    '/assets/images/trioimages/4.png',
    '/assets/images/trioimages/5.png'
  ];

  useEffect(() => {
    // Set up automatic slideshow
    intervalRef.current = setInterval(() => {
      goToNextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalRef.current);
  }, [currentSlide]);

  const goToNextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
      setIsAnimating(false);
    }, 500);
  };

  const goToPrevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 500);
  };

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.carousel}>
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>
      
      <div className={styles.arrows}>
        <button 
          className={`${styles.arrow} ${styles.arrowLeft}`} 
          onClick={goToPrevSlide}
          aria-label="Previous slide"
        >
          &larr;
        </button>
        <button 
          className={`${styles.arrow} ${styles.arrowRight}`} 
          onClick={goToNextSlide}
          aria-label="Next slide"
        >
          &rarr;
        </button>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>TIMELESS ELEGANCE</h2>
        <Button 
          variant="dark" 
          className={styles.discoverButton}
        >
          Discover
        </Button>
      </div>

      <div className={styles.indicators}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;