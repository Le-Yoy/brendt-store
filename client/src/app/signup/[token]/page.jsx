'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import '@/styles/admin-theme.css';

const API = 'https://brendt-store-production-d6ef.up.railway.app/api';

const roleLabel = (r) => (r === 'atelier' ? 'Atelier (opérateur)' : r === 'admin' ? 'Administrateur' : 'Membre');

export default function InviteSignupPage() {
  const { token } = useParams();
  const router = useRouter();
  const { acceptInvite } = useAuth();

  const [checking, setChecking] = useState(true);
  const [invite, setInvite] = useState(null); // { role, email, label }
  const [invalid, setInvalid] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await fetch(`${API}/users/invite/${token}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setInvalid(true);
        } else {
          setInvite(data.data);
          setForm((f) => ({ ...f, email: data.data.email || '', name: data.data.label || '' }));
        }
      } catch (e) {
        setInvalid(true);
      } finally {
        setChecking(false);
      }
    };
    validate();
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.password || (!invite?.email && !form.email)) {
      setError('Veuillez renseigner votre nom, email et mot de passe.');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setSubmitting(true);
    const user = await acceptInvite(token, {
      name: form.name,
      email: invite?.email || form.email,
      password: form.password,
    });
    setSubmitting(false);
    if (user) {
      if (user.role === 'atelier') router.push('/atelier');
      else if (user.role === 'admin') router.push('/admin');
      else router.push('/account');
    } else {
      setError("Échec de l'inscription. Le lien est peut-être déjà utilisé ou expiré.");
    }
  };

  return (
    <div className="admin-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="adm-card adm-card-pad" style={{ width: '100%', maxWidth: 420 }}>
        <h1 className="adm-page-title" style={{ marginBottom: '.25rem' }}>BRENDT</h1>

        {checking ? (
          <div className="adm-spinner" />
        ) : invalid ? (
          <div className="adm-empty">
            <div className="adm-empty-title">Invitation invalide</div>
            Ce lien d'invitation est invalide, expiré ou déjà utilisé. Demandez-en un nouveau.
          </div>
        ) : (
          <>
            <p className="adm-page-sub" style={{ marginBottom: '1.25rem' }}>
              Créez votre compte — rôle&nbsp;: <strong>{roleLabel(invite.role)}</strong>
            </p>

            {error && (
              <div className="adm-badge adm-badge--danger" style={{ display: 'block', padding: '.6rem .8rem', marginBottom: '1rem', borderRadius: 'var(--adm-radius-sm)' }}>
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="adm-field">
                <label className="adm-label">Nom complet</label>
                <input className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Votre nom" />
              </div>
              <div className="adm-field">
                <label className="adm-label">Email</label>
                <input
                  className="adm-input" type="email"
                  value={invite.email || form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!!invite.email}
                  placeholder="vous@exemple.com"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Mot de passe</label>
                <input className="adm-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Au moins 6 caractères" />
              </div>
              <button type="submit" className="adm-btn adm-btn--primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Création…' : 'Créer mon compte'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
