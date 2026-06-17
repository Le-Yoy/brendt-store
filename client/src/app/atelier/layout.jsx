// src/app/atelier/layout.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationProvider } from '@/contexts/NotificationContext';
import useAuth from '@/hooks/useAuth';
import '@/styles/admin-theme.css';

export default function AtelierPageLayout({ children }) {
  const { user, isAuthenticated, loading, isAdmin, isAtelier } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    // Allow admin and atelier roles; everyone else goes to login.
    if (!isAuthenticated || (!isAdmin && !isAtelier)) {
      router.push('/login?redirect=/atelier');
      return;
    }
    setIsChecking(false);
  }, [isAuthenticated, isAdmin, isAtelier, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="admin-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--adm-text-muted)' }}>
        Vérification des autorisations...
      </div>
    );
  }

  return <NotificationProvider>{children}</NotificationProvider>;
}
