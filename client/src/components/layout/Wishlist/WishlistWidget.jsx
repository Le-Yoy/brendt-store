// src/components/layout/Wishlist/WishlistWidget.jsx
import React from 'react';
import { FiX, FiHeart, FiShoppingBag } from 'react-icons/fi';
import './WishlistWidget.css'; // You'll need to create this file using the CSS provided

const WishlistWidget = ({ onClose, wishlistItems = [] }) => {
  return (
    <div className="wishlist-widget open">
      <div className="wishlist-widget__header">
        <h2>Mes coups de coeur</h2>
        <button onClick={onClose} aria-label="Fermer">
          <FiX />
        </button>
      </div>
      
      <div className="wishlist-widget__content">
        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty__icon">
              <FiHeart size={32} />
            </div>
            <h3>Votre liste de coup de coeur est vide</h3>
            <p>Explorez notre collection et ajoutez vos pièces préférées</p>
            <a href="/homme" className="wishlist-empty-btn">Découvrir la collection</a>
          </div>
        ) : (
          <>
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="wishlist-item__image" 
                />
                <div className="wishlist-item__details">
                  <h3 className="wishlist-item__name">{item.name}</h3>
                  <p className="wishlist-item__variant">{item.variant}</p>
                  <p className="wishlist-item__price">{item.price} €</p>
                  <div className="wishlist-item__actions">
                    <button 
                      className="wishlist-item__action-btn"
                      aria-label="Ajouter au panier"
                    >
                      <FiShoppingBag size={14} />
                      <span>Ajouter au panier</span>
                    </button>
                    <button 
                      className="wishlist-item__action-btn wishlist-item__remove"
                      aria-label="Supprimer"
                    >
                      <FiX size={14} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistWidget;