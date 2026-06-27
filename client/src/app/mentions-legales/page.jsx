// client/src/app/mentions-legales/page.jsx
'use client';

import React from 'react';
import styles from '../privacy-policy/privacy-policy.module.css';

const MentionsLegales = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Mentions Légales</h1>
          <p className={styles.subtitle}>
            Informations légales et coordonnées de l'éditeur
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Éditeur du site</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Le site brendtshoes.com (ci-après « le Site ») est édité et exploité par :
              </p>
              <div className={styles.contactCard}>
                <div className={styles.contactInfo}>
                  <h3 className={styles.contactTitle}>BRENDT</h3>
                  <p className={styles.contactDetail}>
                    <strong>Société :</strong> BOUTALEB LLC
                  </p>
                  <p className={styles.contactDetail}>
                    <strong>Adresse :</strong> 30 N Gould St STE N, Sheridan, WY 82801, États-Unis
                  </p>
                  <p className={styles.contactDetail}>
                    <strong>Email :</strong>{' '}
                    <a href="mailto:support@brendtshoes.com" className={styles.contactLink}>
                      support@brendtshoes.com
                    </a>
                  </p>
                  <p className={styles.contactDetail}>
                    <strong>Téléphone / WhatsApp :</strong>{' '}
                    <a href="https://wa.me/33773436514" className={styles.contactLink}>
                      +33 7 73 43 65 14
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Directeur de la publication</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Le directeur de la publication est le représentant légal de BOUTALEB LLC.
                Pour toute question relative au contenu du Site, vous pouvez écrire à{' '}
                <a href="mailto:support@brendtshoes.com" className={styles.contactLink}>
                  support@brendtshoes.com
                </a>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Hébergement</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Le Site est hébergé par les prestataires suivants :
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Front-end :</strong> Vercel Inc. — 340 S Lemon Ave #4133, Walnut,
                  CA 91789, États-Unis — vercel.com
                </li>
                <li className={styles.listItem}>
                  <strong>Back-end :</strong> Railway Corporation — États-Unis — railway.app
                </li>
                <li className={styles.listItem}>
                  <strong>Base de données :</strong> MongoDB Atlas (MongoDB, Inc.) — États-Unis
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Propriété intellectuelle</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                L'ensemble des éléments du Site (textes, photographies, illustrations, logos,
                marque BRENDT, charte graphique, mise en page) est protégé par le droit de la
                propriété intellectuelle et demeure la propriété exclusive de BOUTALEB LLC ou de
                ses partenaires. Toute reproduction, représentation ou exploitation, totale ou
                partielle, sans autorisation écrite préalable, est interdite.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Données personnelles &amp; cookies</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Le traitement de vos données personnelles et l'usage des cookies sont décrits dans
                notre{' '}
                <a href="/privacy-policy" className={styles.contactLink}>
                  Politique de Confidentialité
                </a>.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Règlement des litiges</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Conformément à la réglementation européenne, les consommateurs résidant dans
                l'Union européenne peuvent recourir à la plateforme de Règlement en Ligne des
                Litiges (RLL) mise à disposition par la Commission européenne :
              </p>
              <div className={styles.highlightBox}>
                <p className={styles.paragraph} style={{ marginBottom: 0 }}>
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                    style={{ color: 'var(--color-accent)' }}
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
              </div>
              <p className={styles.paragraph}>
                Avant toute démarche, nous vous invitons à nous contacter directement à{' '}
                <a href="mailto:support@brendtshoes.com" className={styles.contactLink}>
                  support@brendtshoes.com
                </a>{' '}
                afin de rechercher une solution amiable.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
