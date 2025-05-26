'use client';

import React, { Suspense } from 'react';

function AdminInventoryContent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800">Admin Inventory</h1>
      <p>This page is temporarily simplified for deployment.</p>
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminInventoryContent />
    </Suspense>
  );
}
