'use client';

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminNotificationsPage() {
  return (
    <AdminLayout>
      <div className="adm-page-header">
        <div className="adm-page-title">Notifications</div>
        <div className="adm-page-sub">
          Bannières et annonces du site.
        </div>
      </div>
      <div className="adm-card">
        <div className="adm-empty">
          <div className="adm-empty-title">Bientôt disponible</div>
          La gestion des notifications n'est pas encore active.
        </div>
      </div>
    </AdminLayout>
  );
}
