// client/src/components/admin/StatsCard.jsx

import React from 'react';
import styles from './StatsCard.module.css';

const StatsCard = ({ title, value, description, icon, change, changeType }) => {
  const getChangeClass = () => {
    if (!change) return styles.changeNeutral;
    return changeType === 'increase' ? styles.changeIncrease : styles.changeDecrease;
  };

  const getChangeIcon = () => {
    if (!change) return null;
    return changeType === 'increase' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${styles.changeIconIncrease}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${styles.changeIconDecrease}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  };

  return (
    <div className={styles.statsCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.iconContainer} style={{ color: 'var(--color-accent)' }}>
          {icon}
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.value}>{value}</div>
        <p className={styles.description}>{description}</p>
      </div>
      {change && (
        <div className={styles.cardFooter}>
          <div className={`${styles.changeIndicator} ${getChangeClass()}`}>
            {getChangeIcon()}
            <span className={`${styles.changeText} ${getChangeClass()}`}>{change}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;