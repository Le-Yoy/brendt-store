'use client';

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="adm-page-header">
        <div className="adm-page-title">Analytique</div>
        <div className="adm-page-sub">
          Tunnel de conversion, paniers abandonnés et insights clients.
        </div>
      </div>
      <div className="adm-card">
        <div className="adm-empty">
          <div className="adm-empty-title">Bientôt disponible</div>
          Cette section sera connectée aux données de conversion et d'abandon de panier.
        </div>
      </div>
    </AdminLayout>
  );
}
