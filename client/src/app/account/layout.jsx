'use client';

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import AccountSidebar from '../../components/account/AccountSidebar/AccountSidebar';

export default function AccountLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Protect all account pages
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="account-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de votre espace personnel...</p>
      </div>
    );
  }

  // If no user (and still on this page), show nothing while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="account-container">
      <div className="account-sidebar">
        <AccountSidebar />
      </div>
      <div className="account-content">
        {children}
      </div>
    </div>
  );
}