'use client';

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminFormsPage() {
  return (
    <AdminLayout>
      <div className="adm-page-header">
        <div className="adm-page-title">Formulaires clients</div>
        <div className="adm-page-sub">
          Messages et demandes envoyés depuis le site.
        </div>
      </div>
      <div className="adm-card">
        <div className="adm-empty">
          <div className="adm-empty-title">Bientôt disponible</div>
          La connexion aux messages clients n'est pas encore active.
        </div>
      </div>
    </AdminLayout>
  );
}
