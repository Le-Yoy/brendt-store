import React, { useState } from 'react';
import styles from './GiftFinder.module.css';

const questions = [
  {
    id: 'recipient',
    question: 'Pour qui choisissez-vous ce cadeau ?',
    options: [
      { id: 'father', label: 'Père' },
      { id: 'partner', label: 'Partenaire' },
      { id: 'friend', label: 'Ami' },
      { id: 'mentor', label: 'Mentor professionnel' },
      { id: 'other', label: 'Autre relation' }
    ]
  },
  {
    id: 'occasion',
    question: 'Quelle est l\'occasion ?',
    options: [
      { id: 'anniversary', label: 'Anniversaire' },
      { id: 'business', label: 'Réussite professionnelle' },
      { id: 'celebration', label: 'Fêtes de fin d\'année' },
      { id: 'thanks', label: 'Remerciement' },
      { id: 'other', label: 'Autre occasion' }
    ]
  },
  {
    id: 'style',
    question: 'Quel style correspond le mieux à sa personnalité ?',
    options: [
      { id: 'classic', label: 'Classique et intemporel' },
      { id: 'modern', label: 'Contemporain et minimaliste' },
      { id: 'creative', label: 'Créatif et distinctif' },
      { id: 'elegant', label: 'Élégant et sophistiqué' },
      { id: 'casual', label: 'Décontracté et naturel' }
    ]
  },
  {
    id: 'priceRange',
    question: 'Quel budget avez-vous envisagé ?',
    options: [
      { id: 'below200', label: 'Moins de 200€' },
      { id: '200to500', label: 'Entre 200€ et 500€' },
      { id: 'above500', label: 'Plus de 500€' }
    ]
  },
  {
    id: 'phone',
    question: 'Souhaitez-vous être contacté par un conseiller ? (optionnel)',
    isContactForm: true
  }
];

export default function GiftFinder({ onClose, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animation, setAnimation] = useState('fadeIn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleSelectOption = (optionId) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: optionId
    };
    
    setAnswers(updatedAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question with animation
      setAnimation('fadeOut');
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnimation('fadeIn');
      }, 300);
    } else {
      completeQuestionnaire(updatedAnswers);
    }
  };
  
  const handlePhoneSubmit = () => {
    // Basic phone validation
    if (phoneNumber && !/^(\+33|0)[1-9](\d{2}){4}$/.test(phoneNumber)) {
      setPhoneError('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    
    const updatedAnswers = {
      ...answers,
      phone: phoneNumber
    };
    
    setAnswers(updatedAnswers);
    
    // Store in localStorage for persistence
    localStorage.setItem('giftFinderAnswers', JSON.stringify(updatedAnswers));
    
    // Send data to admin (prepared for future admin dashboard)
    sendToAdmin(updatedAnswers);
    
    completeQuestionnaire(updatedAnswers);
  };
  
  const handleSkipPhone = () => {
    const updatedAnswers = {
      ...answers,
      phone: null
    };
    
    setAnswers(updatedAnswers);
    localStorage.setItem('giftFinderAnswers', JSON.stringify(updatedAnswers));
    
    // Still send data to admin but mark as "no contact requested"
    sendToAdmin({
      ...updatedAnswers,
      contactRequested: false
    });
    
    completeQuestionnaire(updatedAnswers);
  };
  
  // Function to prepare data for admin dashboard (will be implemented fully later)
  const sendToAdmin = (data) => {
    // This will be replaced with actual API call in the future
    // For now, just log the data that would be sent
    console.log('Data to be sent to admin dashboard:', {
      ...data,
      timestamp: new Date().toISOString(),
      contactRequested: !!data.phone,
      status: 'new'
    });
    
    // Store in localStorage for demo purposes (temporary)
    const existingData = JSON.parse(localStorage.getItem('adminGiftRequests') || '[]');
    const newRequest = {
      id: `request-${Date.now()}`,
      ...data,
      timestamp: new Date().toISOString(),
      contactRequested: !!data.phone,
      status: 'new'
    };
    
    localStorage.setItem('adminGiftRequests', JSON.stringify([...existingData, newRequest]));
  };
  
  const completeQuestionnaire = (finalAnswers) => {
    // All questions answered, map to filters
    const filters = {
      relationship: finalAnswers.recipient || 'all',
      occasion: finalAnswers.occasion || 'all',
      priceRange: finalAnswers.priceRange || 'all'
    };
    
    // Add style-based recommendations
    if (finalAnswers.style === 'classic' || finalAnswers.style === 'elegant') {
      filters.productType = 'shoes';
    } else if (finalAnswers.style === 'creative' || finalAnswers.style === 'casual') {
      filters.productType = 'accessories';
    }
    
    // Include phone data
    filters.contactInfo = finalAnswers.phone || null;
    
    onComplete(filters);
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setAnimation('fadeOut');
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setAnimation('fadeIn');
      }, 300);
    }
  };
  
  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
    setPhoneError('');
  };
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className={styles.giftFinderOverlay}>
      <div className={styles.giftFinderModal}>
        <button className={styles.closeButton} onClick={onClose}>
          <span className={styles.closeIcon}></span>
        </button>
        
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className={`${styles.questionContainer} ${styles[animation]}`}>
          {!currentQuestion.isContactForm ? (
            <>
              <h3 className={styles.questionTitle}>{currentQuestion.question}</h3>
              
              <div className={styles.optionsGrid}>
                {currentQuestion.options.map(option => (
                  <button
                    key={option.id}
                    className={`${styles.optionButton} ${answers[currentQuestion.id] === option.id ? styles.selected : ''}`}
                    onClick={() => handleSelectOption(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className={styles.questionTitle}>{currentQuestion.question}</h3>
              
              <div className={styles.phoneFormContainer}>
                <div className={styles.inputGroup}>
                  <label htmlFor="phoneNumber" className={styles.phoneLabel}>
                    Numéro de téléphone
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    className={styles.phoneInput}
                    placeholder="Ex: 06 12 34 56 78"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                  />
                  {phoneError && <p className={styles.phoneError}>{phoneError}</p>}
                  <p className={styles.phoneNote}>
                    En fournissant votre numéro, vous acceptez d'être contacté par un conseiller BRENDT.
                  </p>
                </div>
                
                <div className={styles.phoneFormActions}>
                  <button 
                    className={styles.submitButton}
                    onClick={handlePhoneSubmit}
                  >
                    Envoyer
                  </button>
                  <button 
                    className={styles.skipButton}
                    onClick={handleSkipPhone}
                  >
                    Passer cette étape
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {currentQuestionIndex > 0 && (
          <button 
            className={styles.previousButton}
            onClick={handlePrevious}
          >
            Précédent
          </button>
        )}
      </div>
    </div>
  );
}