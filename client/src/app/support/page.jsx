// client/src/app/support/page.jsx
'use client';

import React, { useState } from 'react';
import styles from './support.module.css';

const Support = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    orderNumber: '',
    subject: 'Demande de commande',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Service Client</h1>
          <p className={styles.subtitle}>
            Nous sommes là pour vous accompagner dans votre expérience BRENDT
          </p>
        </header>

        <div className={styles.content}>
          {/* Contact Methods */}
          <section className={styles.contactSection}>
            <h2 className={styles.sectionTitle}>Nous contacter</h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <span className={styles.iconEmail}>✉</span>
                </div>
                <h3 className={styles.contactCardTitle}>Support par Email</h3>
                <p className={styles.contactCardDesc}>
                  Pour toutes demandes générales et support commandes
                </p>
                <a href="mailto:support@brendtshoes.com" className={styles.contactLink}>
                  support@brendtshoes.com
                </a>
                <span className={styles.responseTime}>Réponse sous 24-48h</span>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <span className={styles.iconPhone}>☎</span>
                </div>
                <h3 className={styles.contactCardTitle}>Support Téléphone</h3>
                <p className={styles.contactCardDesc}>
                  Assistance directe pendant nos heures d'ouverture
                </p>
                <a href="tel:+19292439936" className={styles.contactLink}>
                  +1 929 243 9936
                </a>
                <span className={styles.responseTime}>Lun-Ven 9h00-17h00 EST</span>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <span className={styles.iconChat}>💬</span>
                </div>
                <h3 className={styles.contactCardTitle}>Chat en Direct</h3>
                <p className={styles.contactCardDesc}>
                  Assistance immédiate pendant les heures d'ouverture
                </p>
                <button className={styles.chatButton}>
                  Démarrer le Chat
                </button>
                <span className={styles.responseTime}>Disponible maintenant</span>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Questions Fréquemment Posées</h2>
            <div className={styles.faqGrid}>
              <div className={styles.faqCard}>
                <h3 className={styles.faqQuestion}>Comment suivre ma commande ?</h3>
                <p className={styles.faqAnswer}>
                  Une fois votre commande expédiée, vous recevrez un numéro de suivi par email. 
                  Vous pouvez également vérifier le statut de votre commande en vous connectant à votre compte.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h3 className={styles.faqQuestion}>Quelle est votre politique de retour ?</h3>
                <p className={styles.faqAnswer}>
                  Nous acceptons les retours dans les 30 jours suivant la livraison. Les articles doivent 
                  être non portés et dans leur état original avec les étiquettes attachées.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h3 className={styles.faqQuestion}>Combien de temps prend la livraison ?</h3>
                <p className={styles.faqAnswer}>
                  Livraison gratuite au Maroc (3-5 jours). Europe : 5-7 jours (15€, gratuit à partir de 75€). 
                  Expédition express disponible pour +10€.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h3 className={styles.faqQuestion}>Quels modes de paiement acceptez-vous ?</h3>
                <p className={styles.faqAnswer}>
                  Nous acceptons les principales cartes de crédit via notre plateforme sécurisée Stripe. 
                  Paiements en EUR, USD, et MAD.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h3 className={styles.faqQuestion}>Livrez-vous à l'international ?</h3>
                <p className={styles.faqAnswer}>
                  Oui, nous livrons dans le monde entier. Maroc (gratuit), Europe, Amérique du Nord, 
                  et autres pays. Les coûts et délais varient selon la destination.
                </p>
              </div>

              <div className={styles.faqCard}>
                <h3 className={styles.faqQuestion}>Comment puis-je échanger un article ?</h3>
                <p className={styles.faqAnswer}>
                  Contactez notre service client pour initier un échange. Nous vous guiderons 
                  dans le processus et vous fournirons une étiquette de retour.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Envoyez-nous un Message</h2>
            <div className={styles.formContainer}>
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Prénom *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nom de famille *</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Numéro de commande</label>
                  <input 
                    type="text" 
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="ex. CMD-001"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Sujet *</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    <option value="Demande de commande">Demande de commande</option>
                    <option value="Retour/Échange">Retour/Échange</option>
                    <option value="Question produit">Question produit</option>
                    <option value="Problème de livraison">Problème de livraison</option>
                    <option value="Réclamation">Réclamation</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Message *</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6" 
                    className={styles.formTextarea}
                    placeholder="Veuillez décrire votre question ou préoccupation en détail..."
                    required
                  />
                </div>
                
                <button type="submit" className={styles.submitButton}>
                  Envoyer le Message
                </button>
              </form>
            </div>
          </section>

          {/* Company Information */}
          <section className={styles.companySection}>
            <div className={styles.companyCard}>
              <div className={styles.companyHeader}>
                <h3 className={styles.companyTitle}>BRENDT</h3>
                <p className={styles.companySubtitle}>Maison de Chaussures de Luxe</p>
              </div>
              
              <div className={styles.companyContent}>
                <div className={styles.companyInfo}>
                  <h4 className={styles.infoTitle}>Informations Société</h4>
                  <div className={styles.infoDetails}>
                    <p className={styles.infoItem}>
                      <span className={styles.infoLabel}>Société :</span>
                      <span className={styles.infoValue}>BOUTALEB LLC</span>
                    </p>
                    <p className={styles.infoItem}>
                      <span className={styles.infoLabel}>Adresse :</span>
                      <span className={styles.infoValue}>
                        30 N GOULD ST STE N<br />
                        SHERIDAN, WY 82801, USA
                      </span>
                    </p>
                    <p className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email :</span>
                      <a href="mailto:support@brendtshoes.com" className={styles.infoLink}>
                        support@brendtshoes.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className={styles.hoursInfo}>
                  <h4 className={styles.infoTitle}>Horaires d'ouverture</h4>
                  <div className={styles.hoursGrid}>
                    <div className={styles.hoursItem}>
                      <span className={styles.hoursDay}>Lundi - Vendredi</span>
                      <span className={styles.hoursTime}>9h00 - 17h00 EST</span>
                    </div>
                    <div className={styles.hoursItem}>
                      <span className={styles.hoursDay}>Samedi</span>
                      <span className={styles.hoursTime}>Sur rendez-vous</span>
                    </div>
                    <div className={styles.hoursItem}>
                      <span className={styles.hoursDay}>Dimanche</span>
                      <span className={styles.hoursTime}>Fermé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Processing Times */}
          <section className={styles.timesSection}>
            <h2 className={styles.sectionTitle}>Temps de Traitement</h2>
            <div className={styles.timesGrid}>
              <div className={styles.timeCard}>
                <div className={styles.timeIcon}>📦</div>
                <h4 className={styles.timeTitle}>Traitement Commande</h4>
                <p className={styles.timeValue}>1-3 jours ouvrables</p>
                <p className={styles.timeDesc}>Préparation et emballage</p>
              </div>
              
              <div className={styles.timeCard}>
                <div className={styles.timeIcon}>📧</div>
                <h4 className={styles.timeTitle}>Réponse Email</h4>
                <p className={styles.timeValue}>24-48 heures</p>
                <p className={styles.timeDesc}>Support client</p>
              </div>
              
              <div className={styles.timeCard}>
                <div className={styles.timeIcon}>🔄</div>
                <h4 className={styles.timeTitle}>Traitement Retour</h4>
                <p className={styles.timeValue}>5-10 jours ouvrables</p>
                <p className={styles.timeDesc}>Après réception</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Support;