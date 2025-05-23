import React, { useState } from 'react';
import Image from 'next/image';
import './ProductGallery.css';

const ProductGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="product-gallery product-gallery--empty">
        <div className="product-gallery__placeholder">
          No images available
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <div className="product-gallery__image-container">
          {/* Using a div with background-image for better control over image display */}
          <div 
            className="product-gallery__main-image" 
            style={{ 
              backgroundImage: `url(${images[activeImage]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Accessible image for screen readers and fallback */}
            <Image 
              src={images[activeImage]}
              alt="Product view"
              width={600}
              height={600}
              className="sr-only"
              priority
            />
          </div>
        </div>
      </div>
      
      <div className="product-gallery__thumbnails">
        {images.map((image, index) => (
          <button
            key={index}
            className={`product-gallery__thumbnail ${
              index === activeImage ? 'product-gallery__thumbnail--active' : ''
            }`}
            onClick={() => setActiveImage(index)}
            aria-label={`View image ${index + 1}`}
          >
            <div 
              className="product-gallery__thumbnail-image"
              style={{ 
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Image 
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="sr-only"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;