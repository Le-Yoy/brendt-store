'use client';

import React, { useEffect, useState } from 'react';
import AtelierLayout from '@/components/atelier/AtelierLayout';
import atelierService from '@/services/atelierService';
import { useNotification } from '@/contexts/NotificationContext';

const fmtMoney = (n) => (typeof n === 'number' ? `${n.toLocaleString('fr-FR')} MAD` : '');

const ageDays = (d) => {
  if (!d) return null;
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  return days;
};
const ageLabel = (d) => {
  const days = ageDays(d);
  if (days === null) return '';
  if (days === 0) return "aujourd'hui";
  if (days === 1) return 'il y a 1 jour';
  return `il y a ${days} jours`;
};

// Mirror of the backend status derivation (Order.getStatus).
const stageOf = (o) => {
  if (o.isCancelled) return 'cancelled';
  if (o.isDelivered) return 'delivered';
  if (o.isShipped) return 'shipped';
  if (o.isPacked) return 'packed';
  if (o.isProcessing) return 'processing';
  return 'pending';
};

// Action definitions per queue.
const ACTIONS = {
  confirm: { status: 'processing', label: 'Confirmer', title: 'Confirmer la commande' },
  prepare: { status: 'packed', label: 'Marquer préparé', title: 'Marquer comme préparé' },
  ship: { status: 'shipped', label: 'Expédier', title: 'Expédier la commande' },
};

export default function AtelierOrdersPage() {
  const { showSuccess, showError } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // { order, action }
  const [form, setForm] = useState({ note: '', carrier: '', trackingNumber: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await atelierService.getOrders();
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setError('Impossible de charger les commandes. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const oldestFirst = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
  const toConfirm = orders.filter((o) => stageOf(o) === 'pending').sort(oldestFirst);
  const toPrepare = orders.filter((o) => stageOf(o) === 'processing').sort(oldestFirst);
  const toShip = orders.filter((o) => stageOf(o) === 'packed').sort(oldestFirst);

  const openModal = (order, action) => {
    setForm({ note: '', carrier: '', trackingNumber: '' });
    setModal({ order, action });
  };

  const submit = async () => {
    if (!modal) return;
    const { order, action } = modal;
    const { status } = ACTIONS[action];
    const payload = { status };
    if (form.note.trim()) payload.note = form.note.trim();
    if (action === 'ship') {
      if (form.carrier.trim()) payload.carrier = form.carrier.trim();
      if (form.trackingNumber.trim()) payload.trackingNumber = form.trackingNumber.trim();
    }
    try {
      setSubmitting(true);
      await atelierService.updateOrderStatus(order._id, payload);
      showSuccess('Commande mise à jour');
      setModal(null);
      await load();
    } catch (e) {
      console.error(e);
      showError('Échec de la mise à jour');
    } finally {
      setSubmitting(false);
    }
  };

  const renderCard = (o, action) => {
    const days = ageDays(o.createdAt);
    const urgent = days !== null && days > 7;
    return (
      <div className="adm-card adm-card-pad" key={o._id} style={{ marginBottom: '.75rem' }}>
        <div className="adm-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: '.75rem' }}>
          <div className="adm-stack" style={{ gap: '.15rem', minWidth: 0 }}>
            <div className="adm-row" style={{ gap: '.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 650 }}>#{o.orderNumber || o._id.substr(-6)}</span>
              <span className="adm-cell-muted">{o.shippingAddress?.fullName || o.user?.name || 'Client'}</span>
              {urgent && <span className="adm-badge adm-badge--danger">en retard</span>}
            </div>
            <div className="adm-cell-muted" style={{ fontSize: '.8rem' }}>
              {o.shippingAddress?.city || ''} · {o.shippingAddress?.phoneNumber || ''} · {ageLabel(o.createdAt)}
            </div>
          </div>
          <span style={{ fontWeight: 650, whiteSpace: 'nowrap' }}>{fmtMoney(o.totalPrice)}</span>
        </div>

        <div className="adm-stack" style={{ gap: '.25rem', margin: '.6rem 0', fontSize: '.85rem' }}>
          {(o.orderItems || []).map((it, i) => (
            <div key={i} className="adm-cell-muted">
              {it.quantity}× {it.name}
              {it.size ? ` — taille ${it.size}` : ''}{it.color ? ` / ${it.color}` : ''}
            </div>
          ))}
        </div>

        <div className="adm-row" style={{ gap: '.5rem', flexWrap: 'wrap' }}>
          <button className="adm-btn adm-btn--primary adm-btn--sm" onClick={() => openModal(o, action)}>
            {ACTIONS[action].label}
          </button>
        </div>
      </div>
    );
  };

  const Section = ({ title, items, action, emptyText }) => (
    <div className="adm-mb-lg">
      <h2 className="adm-card-title" style={{ marginBottom: '.6rem' }}>
        {title} <span className="adm-cell-muted" style={{ fontWeight: 500 }}>({items.length})</span>
      </h2>
      {items.length > 0 ? items.map((o) => renderCard(o, action)) : (
        <div className="adm-card"><div className="adm-empty" style={{ padding: '1.5rem' }}>{emptyText}</div></div>
      )}
    </div>
  );

  return (
    <AtelierLayout>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Commandes</h1>
        <p className="adm-page-sub">Confirmez, préparez et expédiez les commandes. Les plus anciennes d'abord.</p>
      </div>

      {loading ? (
        <div className="adm-spinner" />
      ) : error ? (
        <div className="adm-error">
          <p className="adm-error-msg">{error}</p>
          <button className="adm-btn adm-btn--primary" onClick={load}>Réessayer</button>
        </div>
      ) : (
        <>
          <div className="adm-stats-grid">
            <div className="adm-stat"><div className="adm-stat-label">À confirmer</div><div className="adm-stat-value">{toConfirm.length}</div></div>
            <div className="adm-stat"><div className="adm-stat-label">À préparer</div><div className="adm-stat-value">{toPrepare.length}</div></div>
            <div className="adm-stat"><div className="adm-stat-label">À expédier</div><div className="adm-stat-value">{toShip.length}</div></div>
            <div className="adm-stat"><div className="adm-stat-label">Total actives</div><div className="adm-stat-value">{toConfirm.length + toPrepare.length + toShip.length}</div></div>
          </div>

          <Section title="À confirmer" items={toConfirm} action="confirm" emptyText="Aucune commande à confirmer." />
          <Section title="À préparer" items={toPrepare} action="prepare" emptyText="Aucune commande à préparer." />
          <Section title="À expédier" items={toShip} action="ship" emptyText="Aucune commande à expédier." />
        </>
      )}

      {modal && (
        <div
          onClick={() => !submitting && setModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(16,16,18,.45)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div className="adm-card adm-card-pad" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 440 }}>
            <h3 className="adm-card-title">{ACTIONS[modal.action].title}</h3>
            <p className="adm-cell-muted" style={{ fontSize: '.85rem', marginTop: '-.5rem', marginBottom: '1rem' }}>
              Commande #{modal.order.orderNumber || modal.order._id.substr(-6)} · {modal.order.shippingAddress?.fullName || 'Client'}
            </p>

            {modal.action === 'ship' && (
              <>
                <div className="adm-field">
                  <label className="adm-label">Transporteur</label>
                  <input className="adm-input" value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })} placeholder="ex. Amana, CTM, DHL" />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Numéro de suivi</label>
                  <input className="adm-input" value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} placeholder="Numéro de tracking" />
                </div>
              </>
            )}

            <div className="adm-field">
              <label className="adm-label">Note (optionnel)</label>
              <textarea className="adm-textarea" rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="ex. client rappelé, remarque…" />
            </div>

            <div className="adm-row" style={{ justifyContent: 'flex-end', gap: '.5rem' }}>
              <button className="adm-btn adm-btn--ghost" onClick={() => setModal(null)} disabled={submitting}>Annuler</button>
              <button className="adm-btn adm-btn--primary" onClick={submit} disabled={submitting}>
                {submitting ? '…' : ACTIONS[modal.action].label}
              </button>
            </div>
          </div>
        </div>
      )}
    </AtelierLayout>
  );
}
