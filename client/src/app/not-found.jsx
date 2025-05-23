// src/app/not-found.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404</h1>
      <h2>Page non trouvée</h2>
      <p>Désolé, la page que vous recherchez n'existe pas ou est en cours de développement.</p>
      
      <div className={styles.suggestionLinks}>
        <h3>Vous pourriez être intéressé par:</h3>
        <div className={styles.links}>
          <Link href="/">Accueil</Link>
          <Link href="/homme">Collection Homme</Link>
          <Link href="/femme">Collection Femme</Link>
          <Link href="/cadeaux-pour-lui">Cadeaux</Link>
        </div>
      </div>
      
      <Link href="/" className={styles.homeButton}>
        Retour à l'accueil
      </Link>
    </div>
  );
}