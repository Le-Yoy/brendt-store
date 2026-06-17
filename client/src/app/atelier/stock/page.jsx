'use client';

import React, { useEffect, useState } from 'react';
import AtelierLayout from '@/components/atelier/AtelierLayout';
import atelierService from '@/services/atelierService';

const LOW_THRESHOLD = 10;

export default function AtelierStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await atelierService.getStock();
        setProducts(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setError('Impossible de charger le stock. Réessayez.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusOf = (c) => {
    if (!c.inStock || c.stock === 0) return { cls: 'adm-badge--danger', label: 'Rupture', rank: 0 };
    if (c.stock <= LOW_THRESHOLD) return { cls: 'adm-badge--warn', label: 'Faible', rank: 1 };
    return { cls: 'adm-badge--ok', label: 'OK', rank: 2 };
  };

  // Urgency = the worst color status of the product (rupture first, then faible).
  const urgency = (p) => Math.min(...p.colors.map((c) => statusOf(c).rank), 2);
  const sorted = [...products].sort((a, b) => urgency(a) - urgency(b));

  return (
    <AtelierLayout>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Stock à fabriquer</h1>
        <p className="adm-page-sub">Vue du stock par couleur — ruptures et stock faible en premier.</p>
      </div>

      {loading ? (
        <div className="adm-spinner" />
      ) : error ? (
        <div className="adm-error">
          <p className="adm-error-msg">{error}</p>
          <button className="adm-btn adm-btn--primary" onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="adm-card"><div className="adm-empty">Aucun produit.</div></div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Produit</th><th>Couleurs &amp; stock</th></tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p._id}>
                  <td className="adm-cell-strong">{p.name}<div className="adm-cell-muted" style={{ fontSize: '.78rem' }}>{p.categoryName || p.category || ''}</div></td>
                  <td>
                    <div className="adm-stack" style={{ gap: '.4rem' }}>
                      {p.colors.map((c, i) => {
                        const s = statusOf(c);
                        return (
                          <div key={i} className="adm-row" style={{ gap: '.5rem', flexWrap: 'wrap' }}>
                            <span className="adm-swatch" style={{ backgroundColor: c.code }} />
                            <span style={{ fontSize: '.85rem', minWidth: 90 }}>{c.name}</span>
                            <span style={{ fontWeight: 600, fontSize: '.85rem', minWidth: 28, textAlign: 'right' }}>{c.stock || 0}</span>
                            <span className={`adm-badge ${s.cls}`}>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="adm-stat-desc" style={{ marginTop: '1rem' }}>
        Pour ajouter du stock ou une couleur, faites une proposition (bientôt) — validée par l'administrateur.
      </p>
    </AtelierLayout>
  );
}
