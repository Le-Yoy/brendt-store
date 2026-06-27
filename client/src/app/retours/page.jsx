// client/src/app/retours/page.jsx
'use client';

import React from 'react';
import styles from '../privacy-policy/privacy-policy.module.css';

const Retours = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Retours &amp; Droit de Rétractation</h1>
          <p className={styles.subtitle}>
            Votre droit de retour de 14 jours et la procédure à suivre
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Droit de rétractation (14 jours)</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Conformément à la directive européenne 2011/83/UE relative aux droits des
                consommateurs, vous disposez d'un délai de <strong>14 jours</strong> pour vous
                rétracter de votre achat, sans avoir à justifier de motif ni à payer de pénalité.
              </p>
              <p className={styles.paragraph}>
                Ce délai court à compter du jour où vous (ou un tiers que vous avez désigné)
                prenez physiquement possession du dernier article de votre commande.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Comment exercer votre droit de retour</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Pour exercer votre droit de rétractation, notifiez-nous votre décision avant
                l'expiration du délai de 14 jours, par une déclaration dénuée d'ambiguïté :
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  Par email à{' '}
                  <a href="mailto:support@brendtshoes.com" className={styles.contactLink} style={{ color: 'var(--color-accent)' }}>
                    support@brendtshoes.com
                  </a>
                </li>
                <li className={styles.listItem}>
                  Par WhatsApp au{' '}
                  <a href="https://wa.me/33773436514" className={styles.contactLink} style={{ color: 'var(--color-accent)' }}>
                    +33 7 73 43 65 14
                  </a>
                </li>
                <li className={styles.listItem}>
                  En utilisant le modèle de formulaire de rétractation ci-dessous (facultatif)
                </li>
              </ul>
              <p className={styles.paragraph}>
                Nous vous communiquerons sans délai l'adresse de retour. Vous disposez alors de
                14 jours après nous avoir notifié votre rétractation pour nous renvoyer l'article.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Conditions de retour</h2>
            <div className={styles.sectionContent}>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  Les articles doivent être <strong>non portés</strong>, dans leur état d'origine,
                  avec leur emballage et leurs étiquettes intacts.
                </li>
                <li className={styles.listItem}>
                  Votre responsabilité n'est engagée qu'à l'égard de la dépréciation des biens
                  résultant de manipulations autres que celles nécessaires pour établir leur
                  nature, leurs caractéristiques et leur bon fonctionnement.
                </li>
                <li className={styles.listItem}>
                  Nous recommandons un envoi suivi : la preuve d'expédition vous protège jusqu'à la
                  réception du colis par nos soins.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Frais de retour</h2>
            <div className={styles.sectionContent}>
              <div className={styles.highlightBox}>
                <p className={styles.paragraph} style={{ marginBottom: 0 }}>
                  Les <strong>frais directs de renvoi</strong> de l'article sont à la charge du
                  client en cas de rétractation. En revanche, si l'article est{' '}
                  <strong>défectueux, non conforme ou erroné</strong> (erreur de notre part), nous
                  prenons en charge l'intégralité des frais de retour et de réexpédition.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Remboursement</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Nous vous rembourserons l'intégralité des sommes versées, y compris les frais de
                livraison standard initiaux, au plus tard <strong>14 jours</strong> après avoir été
                informés de votre décision de rétractation.
              </p>
              <p className={styles.paragraph}>
                Nous pouvons différer le remboursement jusqu'à la récupération de l'article ou
                jusqu'à ce que vous nous ayez fourni une preuve de son expédition, la date retenue
                étant celle du premier de ces faits. Le remboursement est effectué via le même
                moyen de paiement que celui utilisé lors de la commande, sans frais supplémentaires.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Produits défectueux &amp; garantie</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Tous nos articles bénéficient de la garantie légale de conformité. Si un produit
                présente un défaut de fabrication ou arrive endommagé, contactez-nous dans les plus
                brefs délais à{' '}
                <a href="mailto:support@brendtshoes.com" className={styles.contactLink}>
                  support@brendtshoes.com
                </a>{' '}
                avec une photo du défaut : nous procéderons au remplacement ou au remboursement,
                sans frais pour vous.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Modèle de formulaire de rétractation</h2>
            <div className={styles.sectionContent}>
              <p className={styles.paragraph}>
                Vous pouvez, si vous le souhaitez, copier et compléter le formulaire ci-dessous,
                puis nous l'envoyer par email. Son utilisation est facultative.
              </p>
              <div className={styles.highlightBox}>
                <p className={styles.paragraph}>
                  À l'attention de BRENDT (BOUTALEB LLC), support@brendtshoes.com :
                </p>
                <p className={styles.paragraph}>
                  Je / nous (*) vous notifie / notifions (*) par la présente ma / notre (*)
                  rétractation du contrat portant sur la vente du bien ci-dessous :
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Commandé le (*) / reçu le (*) : __________</li>
                  <li className={styles.listItem}>Numéro de commande : __________</li>
                  <li className={styles.listItem}>Nom du / des consommateur(s) : __________</li>
                  <li className={styles.listItem}>Adresse du / des consommateur(s) : __________</li>
                  <li className={styles.listItem}>Date : __________</li>
                  <li className={styles.listItem}>
                    Signature (uniquement en cas de notification sur papier) : __________
                  </li>
                </ul>
                <p className={styles.paragraph} style={{ marginBottom: 0 }}>
                  (*) Rayez la mention inutile.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Retours;
