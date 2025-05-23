// src/components/cart/CartItem/CartItem.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import useCart from '../../../hooks/useCart';
import styles from './CartItem.module.css';

export default function CartItem({ item }) {
  const { removeItem, updateQuantity, formatPrice } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    updateQuantity(item.productId, item.size, item.color, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.productId, item.size, item.color);
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImage}>
        {item.image ? (
          <Image 
            src={item.image} 
            alt={item.name} 
            width={100} 
            height={100} 
            className={styles.productImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{item.name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <div className={styles.itemVariants}>
          <span className={styles.colorVariant} style={{ backgroundColor: item.colorCode }}></span>
          <span className={styles.sizeVariant}>{item.size}</span>
        </div>
        <div className={styles.itemPrice}>{formatPrice(item.price)}</div>
        
        <div className={styles.itemActions}>
          <div className={styles.quantityControls}>
            <button 
              className={styles.quantityButton}
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className={styles.quantityValue}>{quantity}</span>
            <button 
              className={styles.quantityButton}
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </button>
          </div>
          
          <button className={styles.removeButton} onClick={handleRemove}>
            Supprimer
          </button>
        </div>
      </div>
      
      <div className={styles.itemTotal}>
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
}