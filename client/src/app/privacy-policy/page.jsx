// client/src/app/privacy-policy/page.jsx
'use client';

import React from 'react';
import styles from './privacy-policy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Politique de Confidentialité</h1>
          <p className={styles.subtitle}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Informations que nous collectons</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Chez BRENDT, nous collectons les informations que vous nous fournissez directement, notamment lorsque vous :
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Créez un compte sur notre plateforme</li>
                <li className={styles.listItem}>Effectuez un achat de nos produits</li>
                <li className={styles.listItem}>Contactez notre service client</li>
                <li className={styles.listItem}>Vous abonnez à notre newsletter</li>
              </ul>
              <p className={styles.paragraph}>
                Ces informations peuvent inclure votre nom, adresse e-mail, numéro de téléphone, 
                adresse de livraison, adresse de facturation et informations de paiement.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Utilisation de vos informations</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Nous utilisons les informations collectées pour :
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>Traiter et exécuter vos commandes</li>
                <li className={styles.listItem}>Communiquer avec vous concernant vos achats</li>
                <li className={styles.listItem}>Fournir un support client de qualité</li>
                <li className={styles.listItem}>Vous envoyer des communications marketing (avec votre consentement)</li>
                <li className={styles.listItem}>Améliorer nos produits et services</li>
                <li className={styles.listItem}>Respecter nos obligations légales</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Partage d'informations</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Nous ne vendons, n'échangeons ou ne transférons pas vos informations personnelles à des tiers, 
                sauf dans les cas décrits dans cette politique. Nous pouvons partager vos informations avec :
              </p>
              <div className={styles.highlightBox}>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <strong>Processeurs de paiement</strong> (Stripe) pour traiter vos transactions
                  </li>
                  <li className={styles.listItem}>
                    <strong>Services de livraison</strong> pour expédier vos commandes
                  </li>
                  <li className={styles.listItem}>
                    <strong>Prestataires techniques</strong> qui nous aident à exploiter notre plateforme
                  </li>
                  <li className={styles.listItem}>
                    <strong>Autorités légales</strong> lorsque requis par la loi
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Sécurité des données</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations 
                personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction.
              </p>
              <p className={styles.paragraph}>
                Vos informations de paiement sont traitées de manière sécurisée via Stripe et nous ne 
                stockons jamais les détails de votre carte de paiement sur nos serveurs.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Vos droits</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <div className={styles.rightsGrid}>
                <div className={styles.rightItem}>
                  <h4 className={styles.rightTitle}>Droit d'accès</h4>
                  <p className={styles.rightDescription}>
                    Consulter vos données personnelles
                  </p>
                </div>
                <div className={styles.rightItem}>
                  <h4 className={styles.rightTitle}>Droit de rectification</h4>
                  <p className={styles.rightDescription}>
                    Corriger les informations inexactes
                  </p>
                </div>
                <div className={styles.rightItem}>
                  <h4 className={styles.rightTitle}>Droit à l'effacement</h4>
                  <p className={styles.rightDescription}>
                    Demander la suppression de vos données
                  </p>
                </div>
                <div className={styles.rightItem}>
                  <h4 className={styles.rightTitle}>Droit d'opposition</h4>
                  <p className={styles.rightDescription}>
                    Vous opposer au traitement de vos données
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Nous contacter</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter :
              </p>
              <div className={styles.contactCard}>
                <div className={styles.contactInfo}>
                  <h3 className={styles.contactTitle}>BRENDT</h3>
                  <p className={styles.contactDetail}>
                    <strong>Société :</strong> BOUTALEB LLC
                  </p>
                  <p className={styles.contactDetail}>
                    <strong>Adresse :</strong> 30 N GOULD ST STE N, SHERIDAN, WY 82801, USA
                  </p>
                  <p className={styles.contactDetail}>
                    <strong>Email :</strong> 
                    <a href="mailto:support@brendtshoes.com" className={styles.contactLink}>
                      support@brendtshoes.com
                    </a>
                  </p>
                  <p className={styles.contactDetail}>
                    <strong>Téléphone :</strong> 
                    <a href="tel:+19292439936" className={styles.contactLink}>
                      +1 929 243 9936
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;