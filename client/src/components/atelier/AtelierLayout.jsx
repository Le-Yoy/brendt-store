// client/src/components/atelier/AtelierLayout.jsx
// Operator shell for Simo (atelier). Reuses the admin monochrome shell styles.
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import styles from '@/components/admin/AdminLayout.module.css';

const navigationItems = [
  { name: 'Commandes', href: '/atelier', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { name: 'Stock', href: '/atelier/stock', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
];

const NavIcon = ({ d }) => (
  <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

const AtelierLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <div className={`admin-shell ${styles.loadingContainer}`}>Chargement...</div>;
  }

  const handleLogout = () => {
    if (logout) logout();
    router.push('/login?redirect=/atelier');
  };

  return (
    <div className={`admin-shell ${styles.layout}`}>
      {sidebarOpen && <div className={styles.backdrop} onClick={() => setSidebarOpen(false)} />}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <span className={styles.brandName}>BRENDT Atelier</span>
          <button className={styles.closeButton} onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className={styles.nav}>
          {navigationItems.map((item) => {
            const isActive = item.href === '/atelier'
              ? pathname === '/atelier'
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                <NavIcon d={item.icon} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.user}>
            <div className={styles.userAvatar}>{user.name?.charAt(0)?.toUpperCase() || 'A'}</div>
            <div className={styles.userMeta}>
              <div className={styles.userName}>{user.name || 'Atelier'}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuButton} onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className={styles.mobileBrand}>BRENDT Atelier</span>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default AtelierLayout;
