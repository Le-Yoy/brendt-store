// client/src/components/admin/AdminLayout.jsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import styles from './AdminLayout.module.css';

// Admin navigation links
const navigationItems = [
  { name: 'Tableau de bord', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Utilisateurs', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { name: 'Produits', href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { name: 'Inventaire', href: '/admin/inventory', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { name: 'Commandes', href: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { name: 'Formulaires', href: '/admin/forms', icon: 'M17.2 3.4c.5 0 .9.2 1.2.5l1.7 1.7c.3.3.5.7.5 1.2v2.6c0 .5-.2.9-.5 1.2L12 19.5V22H4v-7.5l8.9-9c.3-.2.7-.4 1.1-.4h3.2zM10.5 16L17 9.5 14.5 7 8 13.5v2.5h2.5z' },
  { name: 'Notifications', href: '/admin/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
];

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'admin') {
    return <div className={styles.loadingContainer}>Chargement...</div>;
  }

  return (
    <div className={styles.adminLayout}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandContainer}>
            <span className={styles.brandName}>BRENDT Admin</span>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => setSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || 
                (pathname.startsWith(item.href) && item.href !== '/admin') || 
                (item.href === '/admin' && pathname === '/admin');
                
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  style={{
                    backgroundColor: isActive ? 'var(--color-accent)' : '',
                    color: isActive ? 'var(--color-white)' : '',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${styles.navIcon} ${!isActive ? styles.navIconInactive : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <span className={styles.userInitial}>
                {user.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user.name || 'Admin'}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <button
            className={styles.menuButton}
            onClick={() => setSidebarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className={styles.mobileTitle}>
            BRENDT Admin
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.notificationButton}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className={styles.mainArea}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;