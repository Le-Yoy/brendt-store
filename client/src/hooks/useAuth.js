// src/hooks/useAuth.js
'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Create auth context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility function to safely access localStorage
  const safeLocalStorage = {
    getItem: (key) => {
      try {
        if (typeof window !== 'undefined') {
          return localStorage.getItem(key);
        }
      } catch (error) {
        console.warn('[AUTH] localStorage access failed:', error);
      }
      return null;
    },
    setItem: (key, value) => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn('[AUTH] localStorage write failed:', error);
      }
    },
    removeItem: (key) => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.warn('[AUTH] localStorage remove failed:', error);
      }
    }
  };

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage - use single key
        const token = safeLocalStorage.getItem('userToken');
        
        if (!token) {
          console.log('[AUTH] No token found, user is not authenticated');
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('[AUTH] Token found, fetching user profile');
        
        // Fetch user profile from API
        const response = await fetch(`https://brendt-store-production-d6ef.up.railway.app/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error(`[AUTH] Profile fetch failed with status: ${response.status}`);
          throw new Error('Failed to load user profile');
        }
        
        const userData = await response.json();
        console.log('[AUTH] User profile loaded successfully');
        
        // Save user data to state and localStorage for persistence
        setUser(userData);
        setIsAuthenticated(true);
        safeLocalStorage.setItem('user-data', JSON.stringify(userData));
      } catch (err) {
        console.error('[AUTH] Error loading user data:', err);
        setError('Failed to load user data');
        setIsAuthenticated(false);
        setUser(null);
        
        // Clean up invalid tokens
        safeLocalStorage.removeItem('userToken');
        safeLocalStorage.removeItem('user-data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AUTH] Attempting login with:', email);
      
      const response = await fetch('https://brendt-store-production-d6ef.up.railway.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('[AUTH] Response received. Status:', response.status);
      
      const responseData = await response.json();
      console.log('[AUTH] Response data:', { 
        success: responseData.success, 
        hasToken: !!responseData.token,
        hasData: !!responseData.data 
      });
      
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || 'Authentication failed');
      }
      
      // Handle successful login - backend sends data in 'data' object
      if (responseData.token && responseData.data) {
        // Store token
        safeLocalStorage.setItem('userToken', responseData.token);
        
        // Store user data
        const userData = responseData.data;
        safeLocalStorage.setItem('user-data', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('[AUTH] Login successful for user:', userData._id);
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('[AUTH] Login error:', err.message);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AUTH] Attempting registration for:', userData.email);
      
      const response = await fetch('https://brendt-store-production-d6ef.up.railway.app/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      console.log('[AUTH] Registration response status:', response.status);
      
      const responseData = await response.json();
      console.log('[AUTH] Registration response:', { 
        success: responseData.success, 
        hasToken: !!responseData.token,
        hasData: !!responseData.data 
      });
      
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || 'Registration failed');
      }
      
      // Handle successful registration - backend sends data in 'data' object
      if (responseData.token && responseData.data) {
        // Store token
        safeLocalStorage.setItem('userToken', responseData.token);
        
        // Store user data
        const userInfo = responseData.data;
        safeLocalStorage.setItem('user-data', JSON.stringify(userInfo));
        setUser(userInfo);
        setIsAuthenticated(true);
        
        console.log('[AUTH] Registration successful for user:', userInfo._id);
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('[AUTH] Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Accept a signup invite (e.g. atelier staff). Creates the account with the
  // invite's role and logs the user in. Returns the user object or null.
  const acceptInvite = async (token, { name, email, password }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://brendt-store-production-d6ef.up.railway.app/api/users/invite/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || "Échec de l'inscription");
      }

      if (responseData.token && responseData.data) {
        safeLocalStorage.setItem('userToken', responseData.token);
        safeLocalStorage.setItem('user-data', JSON.stringify(responseData.data));
        setUser(responseData.data);
        setIsAuthenticated(true);
        return responseData.data;
      }
      throw new Error('Réponse invalide du serveur');
    } catch (err) {
      console.error('[AUTH] Accept invite error:', err);
      setError(err.message || "Échec de l'inscription");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('[AUTH] Logging out user');
    safeLocalStorage.removeItem('userToken');
    safeLocalStorage.removeItem('user-data');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = safeLocalStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`https://brendt-store-production-d6ef.up.railway.app/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const updatedData = await response.json();
      
      // Update local state and storage
      setUser(updatedData);
      safeLocalStorage.setItem('user-data', JSON.stringify(updatedData));
      
      return true;
    } catch (err) {
      console.error('[AUTH] Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data function
  const refreshUserData = async () => {
    try {
      const token = safeLocalStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`https://brendt-store-production-d6ef.up.railway.app/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh user data');
      }
      
      const freshData = await response.json();
      
      // Update local state and storage
      setUser(freshData);
      safeLocalStorage.setItem('user-data', JSON.stringify(freshData));
      
      return freshData;
    } catch (err) {
      console.error('[AUTH] Error refreshing user data:', err);
      return null;
    }
  };

  // Value to be provided to context consumers
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    acceptInvite,
    updateProfile,
    refreshUserData,
    isAdmin: user?.role === 'admin',
    isAtelier: user?.role === 'atelier'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.error('[AUTH] useAuth must be used within an AuthProvider');
    // Return a default implementation to prevent crashes
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: 'AuthProvider not found',
      login: () => Promise.resolve(false),
      logout: () => {},
      register: () => Promise.resolve(false),
      acceptInvite: () => Promise.resolve(null),
      updateProfile: () => Promise.resolve(false),
      refreshUserData: () => Promise.resolve(null),
      isAdmin: false,
      isAtelier: false
    };
  }
  
  return context;
}

// Export default
export default useAuth;