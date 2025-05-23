// src/components/account/AccountSidebar/AccountSidebar.jsx
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter import here
import { useAuth } from '@/hooks/useAuth';
import styles from './AccountSidebar.module.css';
import { 
  FiUser, FiPackage, FiMapPin, FiHeart, 
  FiAward, FiLogOut, FiArrowLeft 
} from 'react-icons/fi';

const AccountSidebar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <FiUser size={32} />
        </div>
        <div className={styles.details}>
          <p className={styles.welcome}>Bienvenue,</p>
          <p className={styles.name}>{user?.name || 'Utilisateur'}</p>
        </div>
      </div>
      
      <Link href="/" className={styles.backLink}>
        <FiArrowLeft />
        <span>Retour à la boutique</span>
      </Link>
      
      <nav className={styles.navigation}>
        <Link 
          href="/account"
          className={`${styles.navItem} ${isActive('/account') && pathname === '/account' ? styles.active : ''}`}
        >
          <FiUser />
          <span>Tableau de bord</span>
        </Link>
        
        <Link 
          href="/account/orders"
          className={`${styles.navItem} ${isActive('/account/orders') ? styles.active : ''}`}
        >
          <FiPackage />
          <span>Mes commandes</span>
        </Link>
        
        <Link 
          href="/account/profile"
          className={`${styles.navItem} ${isActive('/account/profile') ? styles.active : ''}`}
        >
          <FiUser />
          <span>Mes informations</span>
        </Link>
        
        <Link 
          href="/account/addresses"
          className={`${styles.navItem} ${isActive('/account/addresses') ? styles.active : ''}`}
        >
          <FiMapPin />
          <span>Mes adresses</span>
        </Link>
        
        <Link 
          href="/account/favorites"
          className={`${styles.navItem} ${isActive('/account/favorites') ? styles.active : ''}`}
        >
          <FiHeart />
          <span>Mes favoris</span>
        </Link>
        
        <Link 
          href="/account/loyalty"
          className={`${styles.navItem} ${isActive('/account/loyalty') ? styles.active : ''}`}
        >
          <FiAward />
          <span>Programme fidélité</span>
        </Link>
      </nav>
      
      <button onClick={handleLogout} className={styles.logoutButton}>
        <FiLogOut />
        <span>Se déconnecter</span>
      </button>
    </div>
  );
};

export default AccountSidebar;