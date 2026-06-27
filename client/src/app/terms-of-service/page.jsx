// client/src/app/terms-of-service/page.jsx
'use client';

import React from 'react';
import styles from './terms-of-service.module.css';

const TermsOfService = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Conditions Générales de Vente</h1>
          <p className={styles.subtitle}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptation des conditions</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                En accédant et en utilisant le site web et les services de BRENDT, vous acceptez 
                et convenez d'être lié par les termes et dispositions de ces conditions générales. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Produits et services</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                BRENDT propose des chaussures et accessoires de cuir de haute qualité, fabriqués 
                avec un savoir-faire artisanal exceptionnel.
              </p>
              <div className={styles.noteBox}>
                <p className={styles.noteText}>
                  Tous les produits sont soumis à disponibilité. Nous nous réservons le droit 
                  d'arrêter la production de tout article à tout moment.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Commande et paiement</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Lorsque vous passez une commande, vous vous engagez à fournir des informations 
                exactes et complètes. Toutes les commandes sont soumises à acceptation et disponibilité.
              </p>
              
              <div className={styles.paymentInfo}>
                <h4 className={styles.subTitle}>Moyens de paiement par région</h4>
                <div className={styles.paymentGrid}>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>Maroc (MAD)</span>
                    <span className={styles.paymentDesc}>Carte bancaire (Stripe) et paiement à la livraison</span>
                  </div>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>Europe, États-Unis &amp; international (EUR / USD)</span>
                    <span className={styles.paymentDesc}>PayPal (compte PayPal ou carte bancaire via PayPal)</span>
                  </div>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>Sécurité</span>
                    <span className={styles.paymentDesc}>Paiements sécurisés — aucune donnée de carte stockée sur nos serveurs</span>
                  </div>
                </div>
              </div>
              <p className={styles.paragraph}>
                Le prix total, toutes taxes et frais de douane compris (livraison DDP à
                l'international), est affiché avant la validation de votre commande. Le bouton de
                paiement vous engage clairement à régler la commande.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Expédition et livraison</h2>
            <div className={styles.sectionContent}>
              <div className={styles.shippingGrid}>
                <div className={styles.shippingZone}>
                  <h4 className={styles.zoneTitle}>Maroc</h4>
                  <div className={styles.zoneDetails}>
                    <span className={styles.zoneTime}>1 à 2 jours ouvrés</span>
                  </div>
                </div>

                <div className={styles.shippingZone}>
                  <h4 className={styles.zoneTitle}>Europe, États-Unis &amp; international</h4>
                  <div className={styles.zoneDetails}>
                    <span className={styles.zoneTime}>5 à 10 jours ouvrés</span>
                    <span className={styles.zoneFree}>Droits de douane et taxes inclus (DDP)</span>
                  </div>
                </div>
              </div>

              <div className={styles.noteBox}>
                <p className={styles.noteText}>
                  Pour les commandes internationales, les droits de douane et taxes sont inclus
                  dans le prix affiché (livraison DDP) : rien à payer à la réception. Un numéro de
                  suivi est communiqué dès l'expédition. Détails complets sur notre page{' '}
                  <a href="/livraison" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                    Livraison &amp; Douanes
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Retours et échanges</h2>
            <div className={styles.sectionContent}>
              <div className={styles.returnPolicy}>
                <div className={styles.policyCard}>
                  <h4 className={styles.policyTitle}>Droit de rétractation 14 jours</h4>
                  <ul className={styles.policyList}>
                    <li className={styles.policyItem}>
                      Droit de rétractation de 14 jours à compter de la réception (directive
                      européenne 2011/83/UE), sans justification
                    </li>
                    <li className={styles.policyItem}>
                      Articles non portés en condition originale avec emballage et étiquettes
                    </li>
                    <li className={styles.policyItem}>
                      Frais directs de retour à la charge du client, sauf article défectueux ou
                      erroné (à notre charge)
                    </li>
                    <li className={styles.policyItem}>
                      Remboursement sous 14 jours après notification, via le moyen de paiement
                      initial
                    </li>
                    <li className={styles.policyItem}>
                      Procédure complète et formulaire de rétractation sur notre page{' '}
                      <a href="/retours" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>
                        Retours &amp; Droit de Rétractation
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className={styles.warrantyCard}>
                  <h4 className={styles.warrantyTitle}>Garantie qualité 90 jours</h4>
                  <p className={styles.warrantyText}>
                    Remplacement gratuit en cas de défaut de fabrication. 
                    Garantie de qualité - remplacement si défectueux à l'arrivée.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Propriété intellectuelle</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Le contenu, l'organisation, les graphiques, le design et tous les éléments 
                liés au site sont protégés par les droits d'auteur, marques déposées et 
                autres droits de propriété intellectuelle de BRENDT.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Informations de contact</h2>
            <div className={styles.sectionContent}>
              <div className={styles.contactSection}>
                <div className={styles.contactCard}>
                  <div className={styles.contactHeader}>
                    <h3 className={styles.contactTitle}>BRENDT</h3>
                    <p className={styles.contactSubtitle}>Service Client</p>
                  </div>
                  
                  <div className={styles.contactDetails}>
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>Société</span>
                      <span className={styles.contactValue}>BOUTALEB LLC</span>
                    </div>
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>Adresse</span>
                      <span className={styles.contactValue}>
                        30 N GOULD ST STE N<br />
                        SHERIDAN, WY 82801, USA
                      </span>
                    </div>
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>Email</span>
                      <a href="mailto:support@brendtshoes.com" className={styles.contactLink}>
                        support@brendtshoes.com
                      </a>
                    </div>
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>Téléphone / WhatsApp</span>
                      <a href="https://wa.me/33773436514" className={styles.contactLink}>
                        +33 7 73 43 65 14
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;