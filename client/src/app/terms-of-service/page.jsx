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
                <h4 className={styles.subTitle}>Moyens de paiement acceptés</h4>
                <div className={styles.paymentGrid}>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>Cartes de crédit</span>
                    <span className={styles.paymentDesc}>Visa, Mastercard, American Express</span>
                  </div>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>Devises</span>
                    <span className={styles.paymentDesc}>EUR, USD, MAD</span>
                  </div>
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>Sécurité</span>
                    <span className={styles.paymentDesc}>Paiements sécurisés via Stripe</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Expédition et livraison</h2>
            <div className={styles.sectionContent}>
              <div className={styles.shippingGrid}>
                <div className={styles.shippingZone}>
                  <h4 className={styles.zoneTitle}>Maroc</h4>
                  <div className={styles.zoneDetails}>
                    <span className={styles.zonePrice}>Gratuit</span>
                    <span className={styles.zoneTime}>3-5 jours ouvrables</span>
                  </div>
                </div>
                
                <div className={styles.shippingZone}>
                  <h4 className={styles.zoneTitle}>Europe</h4>
                  <div className={styles.zoneDetails}>
                    <span className={styles.zonePrice}>15€</span>
                    <span className={styles.zoneTime}>5-7 jours ouvrables</span>
                    <span className={styles.zoneFree}>Gratuit à partir de 75€</span>
                  </div>
                </div>
                
                <div className={styles.shippingZone}>
                  <h4 className={styles.zoneTitle}>Amérique du Nord</h4>
                  <div className={styles.zoneDetails}>
                    <span className={styles.zonePrice}>20€</span>
                    <span className={styles.zoneTime}>7-10 jours ouvrables</span>
                  </div>
                </div>
                
                <div className={styles.shippingZone}>
                  <h4 className={styles.zoneTitle}>Autres pays</h4>
                  <div className={styles.zoneDetails}>
                    <span className={styles.zonePrice}>25€</span>
                    <span className={styles.zoneTime}>10-15 jours ouvrables</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.expressOption}>
                <h4 className={styles.subTitle}>Expédition express</h4>
                <p className={styles.paragraph}>
                  Disponible pour +10€ - Réduction des délais de moitié
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Retours et échanges</h2>
            <div className={styles.sectionContent}>
              <div className={styles.returnPolicy}>
                <div className={styles.policyCard}>
                  <h4 className={styles.policyTitle}>Politique de retour 30 jours</h4>
                  <ul className={styles.policyList}>
                    <li className={styles.policyItem}>
                      Retours acceptés dans les 30 jours suivant la livraison
                    </li>
                    <li className={styles.policyItem}>
                      Articles non portés en condition originale avec emballage et étiquettes
                    </li>
                    <li className={styles.policyItem}>
                      Frais de retour à la charge du client (sauf erreur de notre part)
                    </li>
                    <li className={styles.policyItem}>
                      Remboursement traité sous 5-10 jours ouvrables après réception
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
                      <span className={styles.contactLabel}>Téléphone</span>
                      <a href="tel:+19292439936" className={styles.contactLink}>
                        +1 929 243 9936
                      </a>
                    </div>
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>Horaires</span>
                      <span className={styles.contactValue}>Lun-Ven 9h00-17h00 EST</span>
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