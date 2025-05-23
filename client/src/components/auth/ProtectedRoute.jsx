'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Wait until authentication status is determined
    if (!loading) {
      if (!isAuthenticated) {
        console.log('[AUTH] User not authenticated, redirecting to login');
        router.push('/login');
      } else {
        setChecked(true);
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show nothing during loading or redirect
  if (loading || !checked) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}