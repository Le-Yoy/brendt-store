import React from 'react';
import FAQItem from './FAQItem';
import styles from './FAQContent.module.css';

const FAQContent = ({ category, isMobile }) => {
  if (!category) return null;

  return (
    <div className={styles.faqContent}>
      {!isMobile && (
        <h2 className={styles.categoryTitle}>{category.title}</h2>
      )}
      <div className={styles.questionsContainer}>
        {category.questions.map((item) => (
          <FAQItem 
            key={item.id} 
            question={item.question} 
            answer={item.answer} 
          />
        ))}
      </div>
    </div>
  );
};

export default FAQContent;