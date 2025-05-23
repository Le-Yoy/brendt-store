// src/services/userService.js (Updated)

import api, { setAuthToken, removeAuthToken } from '../utils/api/apiUtils';

/**
 * User Service - Handles user authentication, profile management, and user-related operations
 */
const userService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} User data with token
   */
  register: async (userData) => {
    try {
      console.log('Registering user with data:', { ...userData, password: '***' });
      const response = await api.post('/users', userData, false);
      
      if (response.token) {
        setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Registration error details:', error);
      
      // Handle duplicate email error specifically
      if (error.status === 400) {
        throw new Error('Cet email est déjà utilisé. Veuillez utiliser un autre email ou vous connecter.');
      }
      
      throw new Error(error.message || 'L\'inscription a échoué. Veuillez réessayer.');
    }
  },

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} User data with token
   */
  login: async (credentials) => {
    try {
      console.log('Logging in user with email:', credentials.email);
      const response = await api.post('/users/login', credentials, false);
      console.log('Login response:', response);
      
      // Store the JWT token
      if (response.token) {
        setAuthToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
      
      if (error.isNetworkError) {
        errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    removeAuthToken();
  },

  /**
   * Get the current user's profile
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async () => {
    try {
      return await api.get('/users/profile');
    } catch (error) {
      console.error('Get user profile error:', error);
      const errorMessage = error.message || 'Failed to fetch profile.';
      throw new Error(errorMessage);
    }
  },

  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user profile
   */
  updateUserProfile: async (profileData) => {
    try {
      return await api.put('/users/profile', profileData);
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.message || 'Failed to update profile.';
      throw new Error(errorMessage);
    }
  },

  /**
   * Update user password
   * @param {Object} passwordData - Password update data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise<Object>} Response message
   */
  updatePassword: async (passwordData) => {
    try {
      return await api.put('/users/password', passwordData);
    } catch (error) {
      console.error('Update password error:', error);
      if (error.status === 400) {
        throw new Error('Mot de passe actuel incorrect.');
      }
      throw new Error(error.message || 'Impossible de mettre à jour le mot de passe.');
    }
  },

  /**
   * Update user communication preferences
   * @param {Object} preferencesData - User preferences
   * @returns {Promise<Object>} Updated user profile
   */
  updateUserPreferences: async (preferencesData) => {
    try {
      return await api.put('/users/preferences', preferencesData);
    } catch (error) {
      console.error('Update preferences error:', error);
      throw new Error(error.message || 'Impossible de mettre à jour les préférences.');
    }
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics (order count, total spent, etc.)
   */
  getUserStats: async () => {
    try {
      return await api.get('/users/stats');
    } catch (error) {
      console.error('Get user stats error:', error);
      const errorMessage = error.message || 'Failed to fetch user statistics.';
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Verify user email with token
   * @param {string} token - Email verification token
   * @returns {Promise<Object>} Verification result
   */
  verifyEmail: async (token) => {
    try {
      return await api.get(`/users/verify/${token}`, false);
    } catch (error) {
      console.error('Email verification error:', error);
      const errorMessage = error.message || 'Email verification failed.';
      throw new Error(errorMessage);
    }
  },

  /**
   * Check if current auth token is valid
   * @returns {Promise<boolean>} True if token is valid
   */
  validateToken: async () => {
    try {
      console.log('Validating authentication token');
      // Get token directly from localStorage, not via getAuthToken
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        console.log('No token found to validate');
        return false;
      }
      
      await api.get('/users/profile');
      console.log('Token validation successful');
      return true;
    } catch (error) {
      console.log('Token validation failed:', error);
      removeAuthToken();
      return false;
    }
  }
};

export default userService;