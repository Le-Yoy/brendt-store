// src/app/login/page.jsx
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth'; // Updated import
import styles from './login.module.css';

export default function LoginPage() {
  const { login, loading: authLoading, error: authError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('[LOGIN] Attempting login with:', formData.email);
      const success = await login(formData.email, formData.password);
      
      if (success) {
        console.log('[LOGIN] Login successful, redirecting to:', redirect);
        router.push(redirect);
      } else {
        setError(authError || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('[LOGIN] Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h1>Connectez-vous à votre compte</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          <button
            type="submit"
            className={styles.button}
            disabled={loading || authLoading}
          >
            {loading || authLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <div className={styles.links}>
          <p>
            Vous n'avez pas de compte ? <Link href="/register" className="animated-link">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}