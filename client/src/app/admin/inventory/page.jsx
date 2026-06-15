'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StockManager from '@/components/admin/StockManager';

export default function AdminInventoryPage() {
  return (
    <AdminLayout>
      <StockManager />
    </AdminLayout>
  );
}
