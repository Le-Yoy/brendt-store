// src/components/layout/Cart/CartWidget.jsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import useCart from '../../../hooks/useCart';
import './CartWidget.css';

const CartWidget = ({ onClose }) => {
  const cart = useCart();
  const { items, total, itemCount, removeItem, formatPrice } = cart;

  // Add escape key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Disable body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="cart-widget">
      <div className="cart-widget__content">
        <div className="cart-widget__header">
          <h2 className="cart-widget__title">Votre Panier</h2>
          <button 
            className="cart-widget__close" 
            onClick={onClose}
            aria-label="Fermer le panier"
          >
            <FiX />
          </button>
        </div>
        
        <div className="cart-widget__body">
          {itemCount === 0 ? (
            <div className="cart-widget__empty">
              <div className="cart-widget__empty-icon">
                <FiShoppingBag size={40} />
              </div>
              <p className="cart-widget__empty-text">Votre panier est vide</p>
              <p className="cart-widget__empty-subtext">
                Découvrez notre collection et ajoutez des produits à votre panier.
              </p>
              <Link 
                href="/products" 
                className="cart-widget__browse-btn"
                onClick={onClose}
              >
                Découvrir la collection
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-widget__items">
                {items.map((item, index) => (
                  <div className="cart-widget__item" key={`${item.productId}-${item.size}-${item.color}-${index}`}>
                    <div className="cart-widget__item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="cart-widget__placeholder">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="cart-widget__item-details">
                      <h3 className="cart-widget__item-name">{item.name}</h3>
                      <div className="cart-widget__item-attributes">
                        <span 
                          className="cart-widget__color" 
                          style={{backgroundColor: item.colorCode}}
                        ></span>
                        <span className="cart-widget__size">Taille: {item.size}</span>
                        <span className="cart-widget__quantity">Qté: {item.quantity}</span>
                      </div>
                      <div className="cart-widget__item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                    <button 
                      className="cart-widget__remove-btn"
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      aria-label="Retirer l'article"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-widget__summary">
                <div className="cart-widget__subtotal">
                  <span>Sous-total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="cart-widget__shipping-note">
                  Frais de livraison calculés à la caisse
                </p>
                <div className="cart-widget__actions">
                  <Link 
                    href="/cart" 
                    className="cart-widget__view-cart-btn"
                    onClick={onClose}
                  >
                    Voir le panier
                  </Link>
                  <Link 
                    href="/checkout" 
                    className="cart-widget__checkout-btn"
                    onClick={onClose}
                  >
                    Paiement
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartWidget;