import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/admin/Notification';

// Create context
const NotificationContext = createContext();

// Generate unique IDs for notifications
const generateId = () => `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a notification
  const addNotification = useCallback((notification) => {
    const id = notification.id || generateId();
    
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { ...notification, id }
    ]);
    
    return id;
  }, []);

  // Shorthand functions for different notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      title: options.title || 'Succès',
      duration: options.duration || 5000,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      title: options.title || 'Erreur',
      duration: options.duration || 7000,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      title: options.title || 'Attention',
      duration: options.duration || 6000,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      title: options.title || 'Information',
      duration: options.duration || 5000,
      ...options
    });
  }, [addNotification]);

  // Function to remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Notification container */}
      <div className="fixed right-0 top-0 z-50 p-4 space-y-4 max-w-md w-full max-h-screen overflow-y-auto pointer-events-none">
        {notifications.map(notification => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;