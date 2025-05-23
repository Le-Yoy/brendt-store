'use client';

import React, { useState } from 'react';
import styles from './ContactForm.module.css';

const ContactForm = ({ onSubmit }) => {
  const [formState, setFormState] = useState({
    nom: '',
    email: '',
    telephone: '',
    commande: '',
    sujet: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const subjects = [
    { value: '', label: 'Sélectionnez un sujet' },
    { value: 'information', label: 'Information produit' },
    { value: 'commande', label: 'Commande en cours' },
    { value: 'retour', label: 'Retours et échanges' },
    { value: 'sav', label: 'Service après-vente' },
    { value: 'autre', label: 'Autre demande' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formState.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formState.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formState.sujet) newErrors.sujet = 'Veuillez sélectionner un sujet';
    if (!formState.message.trim()) newErrors.message = 'Le message est requis';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formState.email && !emailRegex.test(formState.email)) {
      newErrors.email = 'Veuillez saisir une adresse email valide';
    }
    
    // Phone validation (optional field)
    const phoneRegex = /^(\+\d{1,3}|0)\s?\d{9,10}$/;
    if (formState.telephone && !phoneRegex.test(formState.telephone)) {
      newErrors.telephone = 'Veuillez saisir un numéro de téléphone valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSubmit(formState);
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="nom" className={styles.label}>
          Nom <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formState.nom}
          onChange={handleChange}
          className={`${styles.input} ${errors.nom ? styles.inputError : ''}`}
          placeholder="Votre nom"
        />
        {errors.nom && <div className={styles.errorMessage}>{errors.nom}</div>}
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            placeholder="Votre email"
          />
          {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="telephone" className={styles.label}>
            Téléphone
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formState.telephone}
            onChange={handleChange}
            className={`${styles.input} ${errors.telephone ? styles.inputError : ''}`}
            placeholder="Votre numéro de téléphone"
          />
          {errors.telephone && <div className={styles.errorMessage}>{errors.telephone}</div>}
        </div>
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="commande" className={styles.label}>
            Numéro de commande
          </label>
          <input
            type="text"
            id="commande"
            name="commande"
            value={formState.commande}
            onChange={handleChange}
            className={styles.input}
            placeholder="Si applicable"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="sujet" className={styles.label}>
            Sujet <span className={styles.required}>*</span>
          </label>
          <select
            id="sujet"
            name="sujet"
            value={formState.sujet}
            onChange={handleChange}
            className={`${styles.select} ${errors.sujet ? styles.inputError : ''}`}
          >
            {subjects.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
          {errors.sujet && <div className={styles.errorMessage}>{errors.sujet}</div>}
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          Message <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formState.message}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          placeholder="Votre message"
          rows={6}
        ></textarea>
        {errors.message && <div className={styles.errorMessage}>{errors.message}</div>}
      </div>
      
      <div className={styles.formFooter}>
        <p className={styles.requiredInfo}>
          <span className={styles.required}>*</span> Champs obligatoires
        </p>
        
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;