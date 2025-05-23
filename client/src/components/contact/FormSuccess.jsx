import React from 'react';
import styles from './FormSuccess.module.css';

const FormSuccess = ({ data, resetForm }) => {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className={styles.successTitle}>Merci pour votre message</h2>
        <p className={styles.successMessage}>
          Nous avons bien reçu votre demande et nous vous répondrons dans les meilleurs délais, généralement sous 24-48 heures ouvrées.
        </p>
        <div className={styles.detailsContainer}>
          <h3 className={styles.detailsTitle}>Récapitulatif de votre demande :</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Nom :</span>
              <span className={styles.detailValue}>{data.nom}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email :</span>
              <span className={styles.detailValue}>{data.email}</span>
            </div>
            {data.telephone && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Téléphone :</span>
                <span className={styles.detailValue}>{data.telephone}</span>
              </div>
            )}
            {data.commande && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>N° de commande :</span>
                <span className={styles.detailValue}>{data.commande}</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Sujet :</span>
              <span className={styles.detailValue}>
                {data.sujet === 'information' && 'Information produit'}
                {data.sujet === 'commande' && 'Commande en cours'}
                {data.sujet === 'retour' && 'Retours et échanges'}
                {data.sujet === 'sav' && 'Service après-vente'}
                {data.sujet === 'autre' && 'Autre demande'}
              </span>
            </div>
          </div>
          <div className={styles.messageItem}>
            <span className={styles.messageLabel}>Message :</span>
            <p className={styles.messageValue}>{data.message}</p>
          </div>
        </div>
        <div className={styles.actionsContainer}>
          <button className={styles.backButton} onClick={resetForm}>
            Envoyer un autre message
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSuccess;