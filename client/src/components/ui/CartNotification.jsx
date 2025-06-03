// src/components/ui/CartNotification.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { FiCheck, FiShoppingBag, FiX } from 'react-icons/fi';
import Link from 'next/link';
import './CartNotification.css';

const CartNotification = ({ 
  isVisible, 
  onClose, 
  product, 
  selectedColor, 
  selectedSize, 
  cartItemCount 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`cart-notification-backdrop ${isAnimating ? 'visible' : ''}`}
        onClick={onClose}
      />
      
      {/* Notification */}
      <div className={`cart-notification ${isAnimating ? 'slide-in' : 'slide-out'}`}>
        <div className="cart-notification__header">
          <div className="cart-notification__icon">
            <FiCheck size={20} />
          </div>
          <h3 className="cart-notification__title">Produit ajouté au panier</h3>
          <button 
            className="cart-notification__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="cart-notification__content">
          <div className="cart-notification__product">
            <div className="cart-notification__image">
              {selectedColor?.images?.[0] ? (
                <img 
                  src={selectedColor.images[0]} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="cart-notification__placeholder"
                style={{ display: selectedColor?.images?.[0] ? 'none' : 'flex' }}
              >
                {product.name.charAt(0)}
              </div>
            </div>

            <div className="cart-notification__details">
              <h4 className="cart-notification__product-name">{product.name}</h4>
              <div className="cart-notification__attributes">
                <span className="cart-notification__color">
                  Couleur: {selectedColor?.name || 'N/A'}
                </span>
                <span className="cart-notification__size">
                  Taille: {selectedSize?.eu || selectedSize?.name || 'N/A'}
                </span>
              </div>
              <div className="cart-notification__price">
                {product.price?.toLocaleString()} MAD
              </div>
            </div>
          </div>

          <div className="cart-notification__summary">
            <div className="cart-notification__cart-count">
              <FiShoppingBag size={16} />
              <span>{cartItemCount} article{cartItemCount > 1 ? 's' : ''} dans le panier</span>
            </div>
          </div>

          <div className="cart-notification__actions">
            <button 
              className="cart-notification__continue"
              onClick={onClose}
            >
              Continuer mes achats
            </button>
            <Link 
              href="/cart"
              className="cart-notification__view-cart"
              onClick={onClose}
            >
              Voir le panier
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartNotification;