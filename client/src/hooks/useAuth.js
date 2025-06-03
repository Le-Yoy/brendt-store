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

  // Load user data on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
        
        if (!token) {
          console.log('[AUTH] No token found, user is not authenticated');
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('[AUTH] Token found, fetching user profile');
        
        // Fetch user profile from API - FIXED: Use hardcoded URL
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
        localStorage.setItem('user-data', JSON.stringify(userData));
      } catch (err) {
        console.error('[AUTH] Error loading user data:', err);
        setError('Failed to load user data');
        setIsAuthenticated(false);
        setUser(null);
        
        // Clean up invalid tokens
        localStorage.removeItem('userToken');
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  // Replace the existing login function in src/hooks/useAuth.js with this implementation:

// Replace the login function in src/hooks/useAuth.js with this version:

// Update the login function in src/hooks/useAuth.js to test different URLs:

const login = async (email, password) => {
  try {
    setLoading(true);
    setError(null);
    
    // Try a direct URL without relying on environment variables
    const apiUrl = 'https://brendt-store-production-d6ef.up.railway.app';
    console.log('[AUTH] Using direct API URL:', apiUrl);
    
    // Log the exact URL being accessed
    const loginUrl = `${apiUrl}/api/users/login`;
    console.log('[AUTH] Attempting login at:', loginUrl);
    
    // Make the request with detailed logging
    console.log('[AUTH] Request payload:', { email, password: '******' });
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    console.log('[AUTH] Response received. Status:', response.status);
    console.log('[AUTH] Response headers:', Object.fromEntries([...response.headers.entries()]));
    
    if (response.status === 404) {
      console.error('[AUTH] ENDPOINT NOT FOUND! Check server routes configuration');
      // Try an alternative endpoint as a test
      console.log('[AUTH] Testing alternative endpoint...');
      
      const testResponse = await fetch(`${apiUrl}/api/test`, {
        method: 'GET'
      });
      
      console.log('[AUTH] Test endpoint response:', testResponse.status);
      if (testResponse.ok) {
        console.log('[AUTH] Test endpoint works, login endpoint is missing!');
      }
      
      throw new Error('Login service unavailable. Please try again later.');
    }
    
    // Try to parse the response
    let responseData;
    try {
      responseData = await response.json();
      console.log('[AUTH] Response data:', { ...responseData, token: responseData.token ? '[PRESENT]' : '[MISSING]' });
    } catch (parseError) {
      console.error('[AUTH] Failed to parse response:', parseError);
      responseData = {};
    }
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Authentication failed');
    }
    
    // Handle successful login
    if (responseData.token) {
      localStorage.setItem('userToken', responseData.token);
      localStorage.setItem('auth-token', responseData.token);
      
      if (responseData._id) {
        const userData = {
          _id: responseData._id,
          name: responseData.name || '',
          email: responseData.email,
          role: responseData.role || 'user'
        };
        
        localStorage.setItem('user-data', JSON.stringify(userData));
        setUser(userData);
      }
      
      setIsAuthenticated(true);
      return true;
    } else {
      throw new Error('Invalid response from server (no token)');
    }
  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    setError(err.message);
    return false;
  } finally {
    setLoading(false);
  }
};

  // Logout function
  const logout = () => {
    console.log('[AUTH] Logging out user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use direct URL approach
      const apiUrl = 'https://brendt-store-production-d6ef.up.railway.app';
      const registerUrl = `${apiUrl}/api/users/register`;
      
      console.log('[AUTH] Attempting registration at:', registerUrl);
      console.log('[AUTH] Registration payload:', { 
        name: userData.name,
        email: userData.email,
        password: userData.password ? '[PROVIDED]' : '[MISSING]'
      });
      
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      console.log('[AUTH] Registration response status:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('[AUTH] Registration response data:', 
          { ...responseData, token: responseData.token ? '[PRESENT]' : '[MISSING]' });
      } catch (parseError) {
        console.error('[AUTH] Failed to parse registration response:', parseError);
        responseData = {};
      }
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }
      
      // Handle successful registration
      if (responseData.token) {
        localStorage.setItem('userToken', responseData.token);
        localStorage.setItem('auth-token', responseData.token);
        
        const userData = {
          _id: responseData._id,
          name: responseData.name || '',
          email: responseData.email,
          role: responseData.role || 'user'
        };
        
        localStorage.setItem('user-data', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error('Invalid response from server (no token)');
      }
    } catch (err) {
      console.error('[AUTH] Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AUTH] Updating user profile');
      
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // FIXED: Use hardcoded URL instead of environment variable
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
        console.error('[AUTH] Profile update failed:', errorData);
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const updatedData = await response.json();
      console.log('[AUTH] Profile updated successfully');
      
      // Update local state and storage
      setUser(updatedData);
      localStorage.setItem('user-data', JSON.stringify(updatedData));
      
      return true;
    } catch (err) {
      console.error('[AUTH] Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[AUTH] Updating user password');
      
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Ensure the payload has the correct structure
      const payload = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };
      
      // FIXED: Use hardcoded URL instead of environment variable
      const response = await fetch(`https://brendt-store-production-d6ef.up.railway.app/api/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[AUTH] Password update failed:', errorData);
        throw new Error(errorData.message || 'Failed to update password');
      }
      
      const result = await response.json();
      console.log('[AUTH] Password updated successfully');
      
      return true;
    } catch (err) {
      console.error('[AUTH] Password update error:', err);
      setError(err.message || 'Failed to update password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data function
  const refreshUserData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // FIXED: Use hardcoded URL instead of environment variable
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
      localStorage.setItem('user-data', JSON.stringify(freshData));
      
      return freshData;
    } catch (err) {
      console.error('[AUTH] Error refreshing user data:', err);
      return null;
    } finally {
      setLoading(false);
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
    updateProfile,
    updatePassword,
    refreshUserData,
    isAdmin: user?.role === 'admin'
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
      updateProfile: () => Promise.resolve(false),
      updatePassword: () => Promise.resolve(false),
      refreshUserData: () => Promise.resolve(null),
      isAdmin: false
    };
  }
  
  return context;
}

// Also export a default to maintain backward compatibility with existing imports
export default useAuth;