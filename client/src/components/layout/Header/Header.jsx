// src/components/layout/Header/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingBag, FiSearch, FiX, FiHeart, FiUser, FiLogOut } from 'react-icons/fi';
import useCart from '../../../hooks/useCart';
import { useAuth } from '@/hooks/useAuth'; // Updated import
import AccountWidget from '../Account/AccountWidget';
import PreHeader from './PreHeader';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import CartWidget from '../Cart/CartWidget';
import './Header.css';

const Header = () => {
  // Add auth hook
  const { isAuthenticated, user, logout } = useAuth();
  
  // Wrap the useCart hook in a try-catch to prevent errors during SSR or context issues
  let cartData = { itemCount: 0, isCartOpen: false, setCartOpen: () => {} };
  try {
    cartData = useCart();
  } catch (error) {
    console.error('Error using cart:', error);
  }
  
  const { itemCount = 0, isCartOpen: cartContextIsOpen, setCartOpen } = cartData || {};
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0); // Placeholder for wishlist count
  const [isCartOpen, setIsCartOpen] = useState(false);
  const megaMenuTimeoutRef = useRef(null);
  const headerRef = useRef(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // List of menu items that should have dropdowns
  const menuWithDropdowns = ['homme', 'femme', 'cadeaux'];

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen || activeMegaMenu || isCartOpen || isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, activeMegaMenu, isCartOpen, isWishlistOpen]);

  // Handle mega menu hover logic with delay
  const handleMenuMouseEnter = (menuName) => {
    // Only set active menu if it's a menu with a dropdown
    if (menuWithDropdowns.includes(menuName)) {
      clearTimeout(megaMenuTimeoutRef.current);
      setActiveMegaMenu(menuName);
    }
  };

  const handleMenuMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 300);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close other menus when opening mobile menu
    if (!isMobileMenuOpen) {
      setIsCartOpen(false);
      setIsWishlistOpen(false);
      setIsSearchOpen(false);
      setIsAccountOpen(false);
    }
  };

  const toggleCart = () => {
    // Update the cart context state
    setCartOpen(!cartContextIsOpen);
    
    // Update local state for UI consistency
    setIsCartOpen(!isCartOpen);
    
    // Close other menus when opening cart
    if (!isCartOpen) {
      setIsMobileMenuOpen(false);
      setIsWishlistOpen(false);
      setIsSearchOpen(false);
      setIsAccountOpen(false);
    }
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
    // Close other menus when opening wishlist
    if (!isWishlistOpen) {
      setIsMobileMenuOpen(false);
      setIsCartOpen(false);
      setIsSearchOpen(false);
      setIsAccountOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Close other menus when opening search
    if (!isSearchOpen) {
      setIsMobileMenuOpen(false);
      setIsCartOpen(false);
      setIsWishlistOpen(false);
      setIsAccountOpen(false);
    }
  };

  // Search form handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search logic here
    setIsSearchOpen(false);
  };

  // Account Icon 
  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
    // Close other menus when opening account
    if (!isAccountOpen) {
      setIsMobileMenuOpen(false);
      setIsCartOpen(false);
      setIsWishlistOpen(false);
      setIsSearchOpen(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    // Close account menu after logout
    setIsAccountOpen(false);
    // Redirect to home page if needed
    // router.push('/');
  };

  return (
    <header 
      ref={headerRef} 
      className={`header ${isScrolled ? 'header--scrolled' : ''}`}
    >
      <PreHeader />
      <div className="header__main">
        <div className="container header__container">
          {/* Mobile menu toggle button - only visible on mobile */}
          {isMobile && (
            <button 
              className={`header__menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <div className="header__menu-toggle-icon">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          )}
          
          {/* Logo - centered on desktop, absolutely positioned on mobile */}
          <div className={`header__logo ${isMobile ? 'header__logo--mobile' : ''}`}>
            <Link href="/">
              <Image 
                src="/assets/images/logos/brendt-complet-logo.svg" 
                alt="Brendt" 
                width={isMobile ? 90 : 180} 
                height={isMobile ? 30 : 60} 
                priority
              />
            </Link>
          </div>
          
          {/* Search Button - on desktop positioned to the left */}
          {!isMobile && (
            <button 
              className="header__action-btn search-btn" 
              onClick={toggleSearch}
              aria-label="Chercher"
            >
              <FiSearch />
              <span>Chercher</span>
            </button>
          )}
          
          {/* Desktop navigation - hidden on mobile */}
          {!isMobile && (
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li 
                  className={`header__nav-item ${activeMegaMenu === 'homme' ? 'header__nav-item--active' : ''}`}
                  onMouseEnter={() => handleMenuMouseEnter('homme')}
                  onMouseLeave={handleMenuMouseLeave}
                >
                  <span className="header__nav-link">Homme</span>
                </li>
                <li className="header__nav-divider"></li>
                <li 
                  className={`header__nav-item ${activeMegaMenu === 'femme' ? 'header__nav-item--active' : ''}`}
                  onMouseEnter={() => handleMenuMouseEnter('femme')}
                  onMouseLeave={handleMenuMouseLeave}
                >
                  <span className="header__nav-link">Femme</span>
                </li>
                <li className="header__nav-divider"></li>
                <li 
                  className={`header__nav-item ${activeMegaMenu === 'cadeaux' ? 'header__nav-item--active' : ''}`}
                  onMouseEnter={() => handleMenuMouseEnter('cadeaux')}
                  onMouseLeave={handleMenuMouseLeave}
                >
                  <span className="header__nav-link">Cadeaux</span>
                </li>
                <li className="header__nav-divider"></li>
                <li className="header__nav-item">
                  <Link href="/savoir-faire" className="header__nav-link">
                    Savoir-Faire
                  </Link>
                </li>
                <li className="header__nav-divider"></li>
                <li className="header__nav-item">
                  <Link href="/textile-universe" className="header__nav-link">
                    BRENDT Textile
                  </Link>
                </li>
              </ul>
            </nav>
          )}
          
          {/* AccountWidget icons - right side of header */}
          <div className="header__actions">
            <button 
              className="header__action-btn account-btn"
              onClick={toggleAccount}
              aria-label="Mon compte"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {isAuthenticated && <span className="account-dot"></span>}
            </button>

            {/* Wishlist Button - new addition */}
            <button 
              className="header__action-btn wishlist-btn" 
              onClick={toggleWishlist}
              aria-label="Coup de coeur"
            >
              <FiHeart />
              {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
            </button>
            
            {/* Only show search button on mobile in the actions area */}
            {isMobile && (
              <button 
                className="header__action-btn search-btn" 
                onClick={toggleSearch}
                aria-label="Chercher"
              >
                <FiSearch size={20} />
              </button>
            )}
            
            <button 
              className="header__action-btn cart-btn" 
              onClick={toggleCart}
              aria-label="Panier"
            >
              <FiShoppingBag />
              <span className="cart-count">{itemCount || 0}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mega menu for desktop - hidden on mobile */}
      {!isMobile && activeMegaMenu && menuWithDropdowns.includes(activeMegaMenu) && (
        <div 
          className="mega-menu-container"
          onMouseEnter={() => handleMenuMouseEnter(activeMegaMenu)}
          onMouseLeave={handleMenuMouseLeave}
        >
          <MegaMenu activeMegaMenu={activeMegaMenu} />
        </div>
      )}
      
      {/* Mobile menu - only on mobile */}
      {isMobile && isMobileMenuOpen && (
        <MobileMenu 
          onClose={toggleMobileMenu} 
        />
      )}
      
      {/* Cart widget - slide in from right */}
      {isCartOpen && (
  <CartWidget onClose={() => {
    setCartOpen(false);
    setIsCartOpen(false);
  }} />
)}
      
      {/* Wishlist widget - slide in from right */}
      {isWishlistOpen && (
        <div className="wishlist-widget open">
          <div className="wishlist-widget__header">
            <h2>Mes coups de coeur</h2>
            <button onClick={toggleWishlist}>
              <FiX />
            </button>
          </div>
          <div className="wishlist-widget__content">
            {/* Wishlist content will go here */}
            <div className="wishlist-empty">
              <div className="wishlist-empty__icon">
                <FiHeart size={32} />
              </div>
              <h3>Votre liste de coup de coeur est vide</h3>
              <p>Explorez notre collection et ajoutez vos pièces préférées</p>
              <a href="/homme" className="wishlist-empty-btn">Découvrir la collection</a>
            </div>
          </div>
        </div>
      )}
      
      {/* Search overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-overlay__content">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input 
                type="text" 
                className="search-form__input" 
                placeholder="Que recherchez-vous ?" 
                autoFocus
              />
              <button type="submit" className="search-form__button">
                <FiSearch />
              </button>
            </form>
            <button 
              className="search-overlay__close" 
              onClick={toggleSearch}
              aria-label="Fermer la recherche"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
      
      {/* Account widget - enhanced with auth state */}
      {isAccountOpen && (
  <AccountWidget isOpen={isAccountOpen} onClose={toggleAccount} />
)}
    </header>
  );
};

export default Header;