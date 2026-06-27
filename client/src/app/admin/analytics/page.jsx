'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import adminService from '@/services/adminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fmtMoney = (n) =>
  typeof n === 'number' ? `${Math.round(n).toLocaleString('fr-FR')} DH` : '—';

const CURRENCY_SYMBOL = { MAD: 'DH', EUR: '€', USD: '$' };
const fmtCur = (n, cur) =>
  typeof n === 'number'
    ? `${Math.round(n).toLocaleString('fr-FR')} ${CURRENCY_SYMBOL[cur] || cur}`
    : '—';

const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminService.getStoreAnalytics();
        setData(res);
      } catch (e) {
        console.error('[ADMIN] analytics load error', e);
        setError('Impossible de charger les données analytiques. Réessayez.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const funnel = data?.funnel;
  const revenue = data?.revenue;
  // Non-MAD currencies with any activity — shown separately so totals never mix.
  const intlRevenue = (revenue?.byCurrency || []).filter(
    (c) => c.currency !== 'MAD' && (c.realized || c.pending || c.cancelled)
  );
  const products = data?.products;
  const cities = data?.cities || [];
  const cancellations = data?.cancellations;

  const funnelStages = funnel
    ? [
        { label: 'Reçues', value: funnel.received },
        { label: 'Confirmées', value: funnel.confirmed },
        { label: 'Expédiées', value: funnel.shipped },
        { label: 'Livrées', value: funnel.delivered },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Analytique</h1>
        <p className="adm-page-sub">Suivi de la livraison (COD), du chiffre d'affaires réalisé et des produits.</p>
      </div>

      {loading ? (
        <div className="adm-spinner" />
      ) : error ? (
        <div className="adm-error">
          <p className="adm-error-msg">{error}</p>
          <button className="adm-btn adm-btn--primary" onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      ) : (
        <>
          {/* ---------- Fulfillment funnel ---------- */}
          <h2 className="adm-card-title" style={{ marginBottom: '.75rem' }}>Tunnel de traitement</h2>
          <div className="adm-stats-grid">
            {funnelStages.map((s) => (
              <div className="adm-stat" key={s.label}>
                <div className="adm-stat-label">{s.label}</div>
                <div className="adm-stat-value">{s.value}</div>
                <div className="adm-stat-desc">{pct(s.value, funnel.received)}% des commandes</div>
              </div>
            ))}
          </div>

          {/* Stuck-orders alert + cancelled */}
          <div className="adm-grid-2 adm-mb-lg">
            <div className="adm-card adm-card-pad">
              <h3 className="adm-card-title">Commandes en attente</h3>
              {funnel.pending.count > 0 ? (
                <div className="adm-stack" style={{ gap: '.5rem' }}>
                  <div className="adm-row" style={{ justifyContent: 'space-between' }}>
                    <span className="adm-cell-muted">Non confirmées</span>
                    <span className="adm-cell-strong">{funnel.pending.count}</span>
                  </div>
                  <div className="adm-row" style={{ justifyContent: 'space-between' }}>
                    <span className="adm-cell-muted">Âge moyen</span>
                    <span className="adm-cell-strong">{funnel.pending.avgAgeDays} j</span>
                  </div>
                  <div className="adm-row" style={{ justifyContent: 'space-between' }}>
                    <span className="adm-cell-muted">En attente &gt; 7 jours</span>
                    <span className={`adm-badge ${funnel.pending.over7days > 0 ? 'adm-badge--danger' : 'adm-badge--ok'}`}>
                      {funnel.pending.over7days}
                    </span>
                  </div>
                  <p className="adm-stat-desc" style={{ marginTop: '.4rem' }}>
                    Taux de livraison global : {pct(funnel.delivered, funnel.received)}%
                  </p>
                </div>
              ) : (
                <div className="adm-empty" style={{ padding: '1rem 0' }}>Aucune commande en attente</div>
              )}
            </div>

            <div className="adm-card adm-card-pad">
              <h3 className="adm-card-title">Annulations</h3>
              {cancellations?.total > 0 ? (
                <div className="adm-stack" style={{ gap: '.45rem' }}>
                  <div className="adm-row" style={{ justifyContent: 'space-between' }}>
                    <span className="adm-cell-muted">Total annulées</span>
                    <span className="adm-cell-strong">{cancellations.total} ({pct(cancellations.total, funnel.received)}%)</span>
                  </div>
                  {cancellations.reasons.slice(0, 5).map((r) => (
                    <div className="adm-row" key={r.reason} style={{ justifyContent: 'space-between' }}>
                      <span className="adm-cell-muted" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason}</span>
                      <span className="adm-cell-strong">{r.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="adm-empty" style={{ padding: '1rem 0' }}>Aucune annulation</div>
              )}
            </div>
          </div>

          {/* ---------- Revenue ---------- */}
          <h2 className="adm-card-title" style={{ marginBottom: '.75rem' }}>Chiffre d'affaires (MAD — Maroc)</h2>
          <div className="adm-stats-grid">
            <div className="adm-stat">
              <div className="adm-stat-label">Réalisé</div>
              <div className="adm-stat-value">{fmtMoney(revenue.realized)}</div>
              <div className="adm-stat-desc">Livré ou payé</div>
            </div>
            <div className="adm-stat">
              <div className="adm-stat-label">En attente</div>
              <div className="adm-stat-value">{fmtMoney(revenue.pending)}</div>
              <div className="adm-stat-desc">Commandes non encore livrées</div>
            </div>
            <div className="adm-stat">
              <div className="adm-stat-label">Annulé</div>
              <div className="adm-stat-value">{fmtMoney(revenue.cancelled)}</div>
              <div className="adm-stat-desc">CA perdu</div>
            </div>
            <div className="adm-stat">
              <div className="adm-stat-label">Total commandé</div>
              <div className="adm-stat-value">{fmtMoney(revenue.realized + revenue.pending)}</div>
              <div className="adm-stat-desc">Réalisé + en attente</div>
            </div>
          </div>

          {/* ---------- International revenue (per currency) ---------- */}
          {intlRevenue.length > 0 && (
            <div className="adm-table-wrap adm-mb-lg">
              <h3 className="adm-card-title" style={{ marginBottom: '.5rem' }}>Chiffre d'affaires international</h3>
              <table className="adm-table">
                <thead>
                  <tr><th>Devise</th><th>Réalisé</th><th>En attente</th><th>Annulé</th></tr>
                </thead>
                <tbody>
                  {intlRevenue.map((c) => (
                    <tr key={c.currency}>
                      <td className="adm-cell-strong">{c.currency}</td>
                      <td className="adm-cell-muted">{fmtCur(c.realized, c.currency)}</td>
                      <td className="adm-cell-muted">{fmtCur(c.pending, c.currency)}</td>
                      <td className="adm-cell-muted">{fmtCur(c.cancelled, c.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="adm-card adm-card-pad adm-mb-lg">
            <h3 className="adm-card-title">Valeur des commandes par mois (MAD)</h3>
            {revenue.byMonth.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenue.byMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ececef" vertical={false} />
                    <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#9b9ba3' }} tickLine={false} axisLine={{ stroke: '#e7e7ea' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#9b9ba3' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value) => [`${Number(value).toLocaleString('fr-FR')} DH`, 'Commandes']}
                      contentStyle={{ borderRadius: 8, border: '1px solid #e7e7ea', fontSize: 13 }}
                    />
                    <Bar dataKey="sales" fill="#111113" radius={[4, 4, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="adm-empty" style={{ padding: '1.5rem 0' }}>
                Aucune commande livrée/payée sur les 6 derniers mois.
              </div>
            )}
          </div>

          {/* ---------- Products by size & color ---------- */}
          <h2 className="adm-card-title" style={{ marginBottom: '.75rem' }}>Produits vendus</h2>
          <div className="adm-grid-2 adm-mb-lg">
            <ProductBreakdown title="Par taille" rows={products.bySize} />
            <ProductBreakdown title="Par couleur" rows={products.byColor} />
          </div>

          {/* ---------- Orders by city ---------- */}
          <h2 className="adm-card-title" style={{ marginBottom: '.75rem' }}>Commandes par ville</h2>
          {cities.length > 0 ? (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Ville</th><th>Commandes</th><th>Chiffre d'affaires</th></tr>
                </thead>
                <tbody>
                  {cities.map((c) => (
                    <tr key={c.city}>
                      <td className="adm-cell-strong">{c.city}</td>
                      <td className="adm-cell-muted">{c.orders}</td>
                      <td className="adm-cell-muted">{fmtMoney(c.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="adm-card"><div className="adm-empty">Aucune donnée de ville</div></div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

const ProductBreakdown = ({ title, rows }) => (
  <div className="adm-card">
    <div className="adm-card-pad" style={{ borderBottom: '1px solid var(--adm-border)' }}>
      <h3 className="adm-card-title" style={{ margin: 0 }}>{title}</h3>
    </div>
    {rows && rows.length > 0 ? (
      <table className="adm-table">
        <thead>
          <tr><th>{title.replace('Par ', '').replace(/^./, (c) => c.toUpperCase())}</th><th>Unités</th><th>CA</th></tr>
        </thead>
        <tbody>
          {rows.slice(0, 12).map((r) => (
            <tr key={r.key}>
              <td className="adm-cell-strong">{r.key}</td>
              <td className="adm-cell-muted">{r.units}</td>
              <td className="adm-cell-muted">{fmtMoney(r.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="adm-empty" style={{ padding: '1.5rem' }}>Aucune vente</div>
    )}
  </div>
);
