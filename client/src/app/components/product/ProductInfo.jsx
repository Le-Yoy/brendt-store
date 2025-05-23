import React, { useState } from 'react';
import Button from '@/components/common/Button/Button';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import './ProductInfo.css';

const ProductInfo = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Show error or scroll to size selector
      return;
    }

    setAddingToCart(true);
    
    // Simulate API call to add product to cart
    setTimeout(() => {
      console.log('Added to cart:', {
        product: product.id,
        name: product.name,
        color: selectedColor,
        size: selectedSize,
        quantity
      });
      
      setAddingToCart(false);
      // Here you would typically show a confirmation and/or update the cart context
    }, 800);
  };

  return (
    <div className="product-info">
      {/* Product badges (New, Bestseller, Sale) */}
      <div className="product-info__badges">
        {product.isNewArrival && <span className="product-info__badge product-info__badge--new">New</span>}
        {product.isBestseller && <span className="product-info__badge product-info__badge--bestseller">Bestseller</span>}
        {product.discount && <span className="product-info__badge product-info__badge--sale">Sale</span>}
      </div>

      {/* Product name and price */}
      <h1 className="product-info__name">{product.name}</h1>
      
      <div className="product-info__price-container">
        <span className="product-info__price">€{product.price.toLocaleString()}</span>
        
        {product.previousPrice && (
          <span className="product-info__price--old">
            €{product.previousPrice.toLocaleString()}
          </span>
        )}
        
        {product.discount && (
          <span className="product-info__discount">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product rating */}
      {product.rating && (
        <div className="product-info__rating">
          <div className="product-info__stars" style={{ '--rating': product.rating }}>
            ★★★★★
          </div>
          <span className="product-info__rating-count">
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>
      )}

      {/* Product description */}
      <p className="product-info__description">{product.description}</p>

      {/* Product selectors */}
      <div className="product-info__options">
        <ColorSelector 
          colors={product.colors}
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
        />
        
        <SizeSelector 
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeChange={handleSizeChange}
        />
        
        {/* Quantity selector */}
        <div className="product-info__quantity">
          <span className="product-info__quantity-label">Quantity:</span>
          <div className="product-info__quantity-controls">
            <button 
              className="product-info__quantity-button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="product-info__quantity-value">{quantity}</span>
            <button 
              className="product-info__quantity-button"
              onClick={increaseQuantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Add to cart button */}
      <div className="product-info__actions">
        <Button 
          variant="primary" 
          size="large" 
          fullWidth 
          isLoading={addingToCart}
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>

      {/* Additional product information */}
      <div className="product-info__additional">
        <div className="product-info__shipping">
          <p>Free shipping on orders over €500</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;