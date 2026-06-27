// client/src/app/livraison/page.jsx
'use client';

import React from 'react';
import styles from '../privacy-policy/privacy-policy.module.css';

const Livraison = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Livraison &amp; Douanes</h1>
          <p className={styles.subtitle}>
            Délais, suivi et taxes incluses (livraison DDP)
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Délais de livraison estimés</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Vos commandes sont préparées dans notre atelier puis expédiées avec un suivi.
                Les délais estimés à compter de l'expédition sont les suivants :
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Maroc :</strong> 1 à 2 jours ouvrés.
                </li>
                <li className={styles.listItem}>
                  <strong>Europe, États-Unis et reste du monde :</strong> 5 à 10 jours ouvrés.
                </li>
              </ul>
              <p className={styles.paragraph}>
                Ces délais sont donnés à titre indicatif. Conformément à la réglementation
                applicable, nous expédions votre commande dans le délai annoncé et, en tout état de
                cause, dans un délai maximum de 30 jours après la conclusion du contrat. En cas
                d'indisponibilité, vous serez informé et remboursé dans les meilleurs délais.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Droits de douane &amp; taxes (DDP)</h2>
            <div className={styles.sectionContent}>
              <div className={styles.highlightBox}>
                <p className={styles.paragraph} style={{ marginBottom: 0 }}>
                  Pour les commandes internationales, nous appliquons la livraison{' '}
                  <strong>DDP (Delivered Duty Paid)</strong> : les droits de douane et taxes
                  applicables sont <strong>déjà inclus dans le prix affiché</strong>. Vous n'avez{' '}
                  <strong>rien à payer à la réception</strong> de votre colis.
                </p>
              </div>
              <p className={styles.paragraph}>
                Le prix indiqué lors du paiement est le prix total, toutes taxes et frais de
                douane compris.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Suivi de commande</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Un numéro de suivi vous est communiqué dès l'expédition de votre commande, afin que
                vous puissiez suivre votre colis jusqu'à sa livraison. Pour les commandes
                internationales, le suivi est systématique.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Adresse de livraison</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Veuillez vérifier l'exactitude de votre adresse de livraison lors de la commande.
                Pour les paiements via PayPal, nous expédions à l'adresse confirmée associée à
                votre transaction. Toute erreur d'adresse signalée après expédition peut entraîner
                des retards ou des frais supplémentaires.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Retours</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Pour toute information sur les retours, échanges et votre droit de rétractation de
                14 jours, consultez notre page{' '}
                <a href="/retours" className={styles.contactLink} style={{ color: 'var(--color-accent)' }}>
                  Retours &amp; Droit de Rétractation
                </a>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Livraison;
