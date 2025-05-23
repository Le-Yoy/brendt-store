'use client';

import React from 'react';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function AdminPageLayout({ children }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}