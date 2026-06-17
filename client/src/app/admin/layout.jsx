// src/app/admin/layout.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationProvider } from '@/contexts/NotificationContext';
import useAuth from '@/hooks/useAuth';
import '@/styles/admin-theme.css';

export default function AdminPageLayout({ children }) {
  const { user, isAuthenticated, loading, isAdmin, isAtelier } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // Atelier staff don't have admin access — send them to their own area
    // (avoids a redirect loop to /login).
    if (isAuthenticated && isAtelier && !isAdmin) {
      router.push('/atelier');
      return;
    }

    // Check authentication and admin role
    if (!isAuthenticated || !isAdmin) {
      console.log('[ADMIN] Access denied - redirecting to login');
      router.push('/login?redirect=/admin');
      return;
    }

    console.log('[ADMIN] Access granted for admin user:', user?.email);
    setIsChecking(false);
  }, [isAuthenticated, isAdmin, loading, router, user]);

  // Show loading while checking authentication
  if (loading || isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px' 
      }}>
        Vérification des autorisations...
      </div>
    );
  }

  // If we get here, user is authenticated and is admin
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}