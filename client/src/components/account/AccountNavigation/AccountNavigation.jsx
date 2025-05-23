// src/components/account/AccountNavigation/AccountNavigation.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AccountNavigation.module.css';

const AccountNavigation = ({ currentPage, previousPage, title, subtitle }) => {
  const router = useRouter();
  
  const goBack = () => {
    if (previousPage) {
      router.push(previousPage);
    } else {
      router.back();
    }
  };

  return (
    <div className={styles.navigationContainer}>
      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumbs}>
        <Link href="/" className={styles.breadcrumbLink}>
          Accueil
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        
        <Link href="/account" className={styles.breadcrumbLink}>
          Mon Compte
        </Link>
        
        {currentPage !== 'dashboard' && (
          <>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.currentBreadcrumb}>{title}</span>
          </>
        )}
      </div>
      
      {/* Page Header with Back Button */}
      <div className={styles.pageHeader}>
        <button onClick={goBack} className={styles.backButton}>
          Retour
        </button>
        
        <div className={styles.pageTitle}>
          <h1>{title}</h1>
          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
        </div>
      </div>
      
      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <Link 
          href="/account" 
          className={`${styles.quickLink} ${currentPage === 'dashboard' ? styles.active : ''}`}
        >
          Tableau de bord
        </Link>
        
        <Link 
          href="/account/orders" 
          className={`${styles.quickLink} ${currentPage === 'orders' ? styles.active : ''}`}
        >
          Commandes
        </Link>
        
        <Link 
          href="/account/profile" 
          className={`${styles.quickLink} ${currentPage === 'profile' ? styles.active : ''}`}
        >
          Profil
        </Link>
        
        <Link 
          href="/account/addresses" 
          className={`${styles.quickLink} ${currentPage === 'addresses' ? styles.active : ''}`}
        >
          Adresses
        </Link>
      </div>
    </div>
  );
};

export default AccountNavigation;