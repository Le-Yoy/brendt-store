'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCart from '../../hooks/useCart';
import CartNotification from '../ui/CartNotification';
import { useRegion } from '@/contexts/RegionContext';
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
  const router = useRouter();
  const { priceOf, formatProduct } = useRegion();
  const [isMobileView, setIsMobileView] = useState(false);
  const [buttonMessage, setButtonMessage] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  
  // ✨ NEW: Cart notification state
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    setIsMobileView(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // ✨ FIXED: Remove sticky button logic - handle in CSS only
  // Add state for sticky button visibility
  const [stickyButtonVisible, setStickyButtonVisible] = useState(true);
  
  // Handle scroll for sticky button visibility
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking && isMobileView) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Hide when near bottom of page
          if (scrollY + windowHeight >= documentHeight - 100) {
            setStickyButtonVisible(false);
          } else {
            setStickyButtonVisible(true);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    if (isMobileView) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileView]);
  
  // Reset message when selections change
  useEffect(() => {
    setButtonMessage('');
    setIsAddedToCart(false);
    setIsCheckoutLoading(false);
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
  
  // ✨ FIXED: Proper add to cart functionality
  const addToCart = () => {
    if (!validateSelection()) return;
    
    try {
      const success = cart.addItem(product, selectedSize, selectedColor);
      if (success) {
        // Show beautiful notification
        setShowNotification(true);
        setIsAddedToCart(true);
        setButtonMessage('');
        
        // Reset button state after 2 seconds
        setTimeout(() => {
          setIsAddedToCart(false);
        }, 2000);
      } else {
        setButtonMessage('Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setButtonMessage('Erreur lors de l\'ajout au panier');
    }
  };
  
  // ✨ NEW: Direct to checkout functionality
  const proceedToCheckout = () => {
    if (!validateSelection()) return;
    
    setIsCheckoutLoading(true);
    
    try {
      const success = cart.addItem(product, selectedSize, selectedColor);
      
      if (success) {
        // Redirect to checkout page
        router.push('/checkout');
      } else {
        setButtonMessage('Erreur lors de l\'ajout au panier');
        setIsCheckoutLoading(false);
      }
    } catch (error) {
      console.error('Error adding to cart for checkout:', error);
      setButtonMessage('Erreur lors de l\'ajout au panier');
      setIsCheckoutLoading(false);
    }
  };
  
  // Get material info for subtitle
  const getMaterialInfo = () => {
    if (product.materials && product.materials.length > 0) {
      return product.materials.join(', ');
    }
    return '';
  };
  
  // ✨ FIXED: Single price display - remove duplicate prices
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
  
  // Region-aware: EU/US with a regional price set shows the single regional price
  // (per-color price + compare-at/discount are MAD-only for now).
  const isRegional = priceOf(product).currency !== 'MAD';

  // Check if any colors are available
  const hasAvailableColors = product.colors.some(color => color.inStock !== false);
  
  // Filter available colors
  const availableColors = product.colors.filter(color => color.inStock !== false);
  
  return (
    <div className={styles.productInfoContainer}>
      <div className={styles.productHeader}>
        <h1 className={styles.productName}>{product.name}</h1>
        {getMaterialInfo() && (
          <p className={styles.productMaterial}>{getMaterialInfo()}</p>
        )}
        
        {/* ✨ FIXED: Single clean price display */}
        <div className={styles.priceContainer}>
          {isRegional ? (
            <p className={styles.currentPrice}>
              {formatProduct(product)}
            </p>
          ) : (
            <>
              <p className={styles.currentPrice}>
                {formatPriceMAD(getEffectivePrice())}
              </p>

              {product.previousPrice && (
                <>
                  <p className={styles.originalPrice}>
                    {formatPriceMAD(product.previousPrice)}
                  </p>
                  {product.discount && (
                    <span className={styles.discountBadge}>-{product.discount}%</span>
                  )}
                </>
              )}
            </>
          )}
        </div>
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
      
      <div className={styles.colorSection}>
        <p className={styles.sectionTitle}>
          Couleur: <span className={styles.selectedValue}>{getColorName(selectedColor?.name || '')}</span>
        </p>
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
            >
              {selectedColor?.name === color.name && (
                <span className={styles.colorCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.sizeSection}>
        <div className={styles.sizeTitleRow}>
          <p className={styles.sectionTitle}>Taille EU</p>
        </div>
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
              {(!size.available || !product.inStock || !hasAvailableColors) && (
                <span className={styles.unavailableX}>×</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* ✨ FIXED: Proper desktop buttons */}
      <div className={styles.actionsSection}>
        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.addToCartBtn} ${isAddedToCart ? styles.success : ''} ${!product.inStock || !hasAvailableColors ? styles.disabled : ''}`}
            onClick={addToCart}
            disabled={!product.inStock || !hasAvailableColors}
          >
            {!product.inStock || !hasAvailableColors ? 
              'Rupture de stock' : 
              (isAddedToCart ? 'Ajouté au panier ✓' : 'Ajouter au panier')
            }
          </button>
          
          {/* ✨ FIXED: Only show on desktop */}
          {!isMobileView && (
            <button 
              className={`${styles.buyNowBtn} ${isCheckoutLoading ? styles.loading : ''} ${!product.inStock || !hasAvailableColors ? styles.disabled : ''}`}
              onClick={proceedToCheckout}
              disabled={!product.inStock || !hasAvailableColors || isCheckoutLoading}
            >
              {!product.inStock || !hasAvailableColors ? 
                'Rupture de stock' : 
                (isCheckoutLoading ? 'Redirection...' : 'Acheter maintenant')
              }
            </button>
          )}
        </div>
        
        {buttonMessage && !isAddedToCart && (
          <p className={styles.errorMessage}>{buttonMessage}</p>
        )}
      </div>

      {/* ✨ FIXED: Mobile sticky button - only on mobile */}
      {isMobileView && stickyButtonVisible && (
        <div className={styles.mobileSticky}>
          <div className={styles.mobileStickyContent}>
            <button 
              className={`${styles.mobileBuyNowBtn} ${isCheckoutLoading ? styles.loading : ''} ${!product.inStock || !hasAvailableColors ? styles.disabled : ''}`}
              onClick={proceedToCheckout}
              disabled={!product.inStock || !hasAvailableColors || isCheckoutLoading}
            >
              {!product.inStock || !hasAvailableColors ? 
                'Rupture de stock' : 
                (isCheckoutLoading ? 'Redirection...' : 'Acheter maintenant')
              }
            </button>
          </div>
        </div>
      )}

      {/* ✨ Cart Notification */}
      <CartNotification
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        cartItemCount={cart.itemCount || 0}
      />
    </div>
  );
}