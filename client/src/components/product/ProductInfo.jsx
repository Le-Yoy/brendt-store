// src/components/product/ProductInfo.jsx
'use client';

import { useState, useEffect } from 'react';
import useCart from '../../hooks/useCart';
import styles from './ProductInfo.module.css';

const colorNamesInFrench = {
  "Black": "Noir",
  "Brown": "Marron Havane",
  "Navy": "Bleu Marine",
  "Tan": "Fauve",
  "Dark Brown": "Chocolat",
  "Burgundy": "Bordeaux",
  "Cognac": "Cognac",
  "Oxford Blue": "Bleu Oxford",
  "Dark Green": "Vert Anglais",
  "Classique": "Classique"
};

export default function ProductInfo({ 
  product, 
  selectedColor, 
  setSelectedColor,
  selectedSize,
  setSelectedSize
}) {
  const cart = useCart();
  const [isMobileView, setIsMobileView] = useState(false);
  const [buttonMessage, setButtonMessage] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  useEffect(() => {
    setIsMobileView(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Add state for sticky button on mobile
  const [isSticky, setIsSticky] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Handle scroll for sticky button on mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isMobileView) {
        // If scrolling down, hide button
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          setIsSticky(false);
        } 
        // If scrolling up or at top, show button
        else if (currentScrollY < lastScrollY || currentScrollY < 100) {
          setIsSticky(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileView]);
  
  // Reset message when selections change
  useEffect(() => {
    setButtonMessage('');
    setIsAddedToCart(false);
  }, [selectedColor, selectedSize]);
  
  // Get French color name
  const getColorName = (colorName) => {
    return colorNamesInFrench[colorName] || colorName;
  };
  
  const handleColorSelect = (color) => {
    // Only allow selection if color is in stock
    if (color.inStock !== false) {
      setSelectedColor(color);
    }
  };
  
  const handleSizeSelect = (size) => {
    if (size.available) {
      setSelectedSize(size);
    }
  };

  const validateSelection = () => {
    if (!product.inStock) {
      setButtonMessage('Produit temporairement en rupture de stock');
      return false;
    }
    
    if (!selectedColor) {
      setButtonMessage('Veuillez sélectionner une couleur');
      return false;
    }
    
    if (selectedColor.inStock === false) {
      setButtonMessage('Cette couleur n\'est pas disponible');
      return false;
    }
    
    if (!selectedSize) {
      setButtonMessage('Veuillez sélectionner une taille');
      return false;
    }
    
    if (!selectedSize.available) {
      setButtonMessage('Cette taille n\'est pas disponible');
      return false;
    }
    
    return true;
  };
  
  const addToCart = () => {
    if (!validateSelection()) return;
    
    const success = cart.addItem(product, selectedSize, selectedColor);
    if (success) {
      setButtonMessage('Produit ajouté au panier');
      setIsAddedToCart(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setButtonMessage('');
        setIsAddedToCart(false);
      }, 3000);
    }
  };
  
  const proceedToCheckout = () => {
    if (!validateSelection()) return;
    
    const success = cart.addItem(product, selectedSize, selectedColor);
    
    if (success) {
      // Redirect to checkout page
      window.location.href = '/checkout';
    }
  };
  
  // Get material info for subtitle
  const getMaterialInfo = () => {
    if (product.materials && product.materials.length > 0) {
      return product.materials.join(', ');
    }
    return '';
  };
  
  // Format price in MAD with discount
  const formatPriceMAD = (price) => {
    if (!price && price !== 0) return '';
    return `${price.toLocaleString()} MAD`;
  };
  
  // Get effective price (color variant price if available, otherwise main product price)
  const getEffectivePrice = () => {
    if (selectedColor && selectedColor.price !== undefined) {
      return selectedColor.price;
    }
    return product.price;
  };
  
  // Check if any colors are available
  const hasAvailableColors = product.colors.some(color => color.inStock !== false);
  
  // Filter available colors
  const availableColors = product.colors.filter(color => color.inStock !== false);
  
  return (
    <div className={styles.productInfoContainer}>
      <h1 className={styles.productName}>{product.name}</h1>
      <p className={styles.productMaterial}>{getMaterialInfo()}</p>
      
      {/* Enhanced price display with discount and strikethrough */}
      <div className={styles.priceDisplay}>
        <p className={styles.productPrice}>
          {formatPriceMAD(getEffectivePrice())}
        </p>
        
        {product.previousPrice && (
          <>
            <p className={styles.previousPrice}>
              {formatPriceMAD(product.previousPrice)}
            </p>
            {product.discount && (
              <span className={styles.discountBadge}>-{product.discount}%</span>
            )}
          </>
        )}
      </div>
      
      {/* Stock Status Banner */}
      {!product.inStock && (
        <div className={styles.stockWarning}>
          <p className={styles.stockWarningText}>Produit temporairement en rupture de stock</p>
        </div>
      )}
      
      {/* No available colors warning */}
      {product.inStock && !hasAvailableColors && (
        <div className={styles.stockWarning}>
          <p className={styles.stockWarningText}>Toutes les couleurs sont temporairement en rupture de stock</p>
        </div>
      )}
      
      <div className={styles.divider}></div>
      
      <div className={styles.colorSection}>
        <p className={styles.sectionLabel}>Couleur: {getColorName(selectedColor?.name || '')}</p>
        <div className={styles.colorOptions}>
          {product.colors.map((color, index) => (
            <button
              key={`color-${index}`}
              className={`${styles.colorOption} ${selectedColor?.name === color.name ? styles.selectedColor : ''} ${color.inStock === false ? styles.unavailableColor : ''}`}
              style={{ backgroundColor: color.code }}
              onClick={() => handleColorSelect(color)}
              aria-label={`Couleur ${getColorName(color.name)}`}
              title={getColorName(color.name)}
              disabled={!product.inStock || color.inStock === false}
            />
          ))}
        </div>
      </div>
      
      <div className={styles.divider}></div>
      
      <div className={styles.sizeSection}>
        <p className={styles.sectionLabel}>Taille EU</p>
        <div className={styles.sizeOptions}>
          {product.sizes.map((size, index) => (
            <button
              key={`size-${index}`}
              className={`
                ${styles.sizeOption}
                ${selectedSize && selectedSize.eu === size.eu ? styles.selectedSize : ''}
                ${!size.available || !product.inStock || !hasAvailableColors ? styles.unavailableSize : ''}
              `}
              onClick={() => handleSizeSelect(size)}
              disabled={!size.available || !product.inStock || !hasAvailableColors}
            >
              {size.eu || size.name}
              {(!size.available || !product.inStock || !hasAvailableColors) && <span className={styles.unavailableX}>×</span>}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.divider}></div>
      
      <div className={styles.actionButtons}>
        <div className={styles.buttonWrapper}>
          <button 
            className={`${styles.addToCartButton} ${isAddedToCart ? styles.success : ''} ${!product.inStock || !hasAvailableColors ? styles.disabled : ''}`}
            onClick={addToCart}
            disabled={!product.inStock || !hasAvailableColors}
          >
            {!product.inStock || !hasAvailableColors ? 'Rupture de stock' : (isAddedToCart ? 'Ajouté au panier ✓' : 'Ajouter au panier')}
          </button>
          {buttonMessage && !isAddedToCart && (
            <p className={styles.errorMessage}>{buttonMessage}</p>
          )}
        </div>
        
        <div className={`${styles.buttonWrapper} ${isMobileView && isSticky ? styles.mobileSticky : isMobileView ? `${styles.mobileSticky} ${styles.hidden}` : ''}`}>
          <button 
            className={`${styles.checkoutButton} ${!product.inStock || !hasAvailableColors ? styles.disabled : ''}`}
            onClick={proceedToCheckout}
            disabled={!product.inStock || !hasAvailableColors}
          >
            {!product.inStock || !hasAvailableColors ? 'Rupture de stock' : 'Acheter maintenant'}
          </button>
        </div>
      </div>
    </div>
  );
}