'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Analyse des données</h1>
        <p className="text-gray-500 mb-6">Visualisez les performances de votre boutique</p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Analyse du checkout</h2>
          <p>Fonctionnalité en cours de développement.</p>
          <p className="mt-2 text-sm text-gray-500">
            Cette section affichera des analyses détaillées sur les performances du processus de commande, 
            y compris les taux de conversion et les points d'abandon.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}