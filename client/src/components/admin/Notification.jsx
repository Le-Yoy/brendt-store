// client/src/components/admin/Notification.jsx

import React, { useState, useEffect } from 'react';
import styles from './Notification.module.css';

const Notification = ({ 
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  isVisible = true
}) => {
  const [isShowing, setIsShowing] = useState(isVisible);
  const [isExiting, setIsExiting] = useState(false);

  // Effect for auto-dismiss
  useEffect(() => {
    let timeoutId;
    
    if (isShowing && duration > 0) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, duration);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isShowing, duration]);

  // Update visibility when prop changes
  useEffect(() => {
    setIsShowing(isVisible);
  }, [isVisible]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsShowing(false);
      if (onClose) onClose();
    }, 300); // Match animation duration
  };

  if (!isShowing) return null;

  const typeClass = `notification${type.charAt(0).toUpperCase() + type.slice(1)}`;

  return (
    <div className={`${styles.notification} ${styles[typeClass]} ${isExiting ? styles.notificationHide : ''}`}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationIcon}>
          {type === 'success' && (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'error' && (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {type === 'warning' && (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {type === 'info' && (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className={styles.notificationBody}>
          {title && (
            <h3 className={`${styles.notificationTitle} ${styles[`notification${type.charAt(0).toUpperCase() + type.slice(1)}Title`]}`}>
              {title}
            </h3>
          )}
          <div className={`${styles.notificationMessage} ${styles[`notification${type.charAt(0).toUpperCase() + type.slice(1)}Message`]}`}>
            {message}
          </div>
        </div>
        <div className={styles.notificationCloseButton}>
          <div className={styles.closeButtonWrapper}>
            <button
              type="button"
              className={`${styles.closeButton} ${styles[`notification${type.charAt(0).toUpperCase() + type.slice(1)}CloseButton`]}`}
              onClick={handleClose}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;