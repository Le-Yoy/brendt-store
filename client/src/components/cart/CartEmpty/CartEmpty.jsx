// src/components/cart/CartEmpty/CartEmpty.jsx
'use client';

import Link from 'next/link';
import styles from './CartEmpty.module.css';

export default function CartEmpty() {
  return (
    <div className={styles.emptyCartContainer}>
      <div className={styles.emptyIconWrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
      </div>
      
      <h2 className={styles.emptyTitle}>Votre panier est vide</h2>
      <p className={styles.emptyText}>Découvrez notre collection et ajoutez des produits à votre panier.</p>
      
      <Link href="/products" className={styles.shopButton}>
        Découvrir la collection
      </Link>
    </div>
  );
}