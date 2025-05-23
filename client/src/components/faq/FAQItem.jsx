import React, { useState } from 'react';
import styles from './FAQItem.module.css';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>
      <button 
        className={styles.questionButton}
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className={styles.questionText}>{question}</span>
        <span className={styles.toggleIcon}>
          <span className={styles.toggleIconInner}></span>
        </span>
      </button>
      
      <div className={styles.answerContainer}>
        <div className={styles.answer}>{answer}</div>
      </div>
    </div>
  );
};

export default FAQItem;