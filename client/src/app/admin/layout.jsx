// src/app/admin/layout.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationProvider } from '@/contexts/NotificationContext';
import useAuth from '@/hooks/useAuth';

export default function AdminPageLayout({ children }) {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

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