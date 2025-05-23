'use client';

import React, { useState } from 'react';
import ContactForm from './ContactForm';
import FormSuccess from './FormSuccess';
import styles from './ContactPage.module.css';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    // Here you would typically send data to your backend
    console.log('Form submitted:', data);
    
    // For now, just store the data and show success message
    setFormData(data);
    setIsSubmitted(true);
    
    // In a real implementation, you'd make an API call:
    /*
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        setIsSubmitted(true);
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
    */
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nous Contacter</h1>
        <p className={styles.subtitle}>
          Notre équipe est à votre disposition pour répondre à toutes vos questions.
        </p>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.content}>
        {isSubmitted ? (
          <FormSuccess data={formData} resetForm={() => setIsSubmitted(false)} />
        ) : (
          <div className={styles.formContainer}>
            <div className={styles.contactInfo}>
              <h2 className={styles.sectionTitle}>Informations de Contact</h2>
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>Service Client</h3>
                <p className={styles.infoText}>+33 (0)1 23 45 67 89</p>
                <p className={styles.infoText}>Du lundi au vendredi, 9h à 19h</p>
              </div>
              
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>Email</h3>
                <p className={styles.infoText}>service@brendt.com</p>
              </div>
              
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>Adresse</h3>
                <p className={styles.infoText}>BRENDT Paris</p>
                <p className={styles.infoText}>45 Avenue Montaigne</p>
                <p className={styles.infoText}>75008 Paris, France</p>
              </div>
            </div>
            
            <div className={styles.formWrapper}>
              <h2 className={styles.sectionTitle}>Formulaire de Contact</h2>
              <ContactForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;