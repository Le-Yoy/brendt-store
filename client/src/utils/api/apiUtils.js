// src/utils/api/apiUtils.js
// Core API utility for HTTP requests and error handling

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Request throttling variables
const requestTimestamps = {};
const REQUEST_THROTTLE = 2000; // 2 seconds minimum between identical requests
const requestCache = {};

// client/src/utils/api/apiUtils.js - Improve token management

export const getAuthToken = () => {
 if (typeof window === 'undefined') return null;
 
 // First try userToken, then auth-token as fallback
 const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
 
 if (!token) {
   console.warn('[AUTH] No token found in localStorage');
   return null;
 }
 
 // Validate token format and expiration
 if (!isTokenLikelyValid(token)) {
   console.warn('[AUTH] Token appears invalid or expired, removing');
   removeAuthToken();
   return null;
 }
 
 return token;
};

export const setAuthToken = (token) => {
 if (typeof window !== 'undefined') {
   if (!token) {
     console.warn('[AUTH] Attempted to store empty token');
     return;
   }
   localStorage.setItem('userToken', token);
   localStorage.setItem('auth-token', token); // Store in both formats for compatibility
   console.log('[AUTH] Token stored in localStorage');
 }
};

export const removeAuthToken = () => {
 if (typeof window !== 'undefined') {
   localStorage.removeItem('userToken');
   localStorage.removeItem('auth-token');
   console.log('[AUTH] Token removed from localStorage');
 }
};

export const getHeaders = (includeAuth = true) => {
 const headers = {
   'Content-Type': 'application/json',
 };

 if (includeAuth) {
   const token = getAuthToken();
   if (token) {
     headers['Authorization'] = `Bearer ${token}`;
     console.log('[AUTH] Adding token to request headers');
   } else {
     console.warn('[AUTH] No token found for authenticated request');
   }
 }

 return headers;
};

// Test if token is likely valid (not expired and correctly formatted)
export const isTokenLikelyValid = (token) => {
 if (!token) return false;
 
 try {
   // JWT structure is: header.payload.signature
   const parts = token.split('.');
   if (parts.length !== 3) return false;
   
   // Try to decode the payload
   const payload = JSON.parse(atob(parts[1]));
   
   // Check if token has expiration claim
   if (payload.exp) {
     // Token expiration is in seconds since epoch
     const expiry = payload.exp * 1000; // Convert to milliseconds
     const now = Date.now();
     
     // Token is valid if expiry is in the future
     const isValid = expiry > now;
     
     if (!isValid) {
       console.warn('[AUTH] Token appears to be expired:', new Date(expiry).toISOString());
     }
     
     return isValid;
   }
   
   // If no expiration claim, assume it's valid
   return true;
 } catch (error) {
   console.error('[AUTH] Error checking token validity:', error);
   return false;
 }
};

// Enhanced error formatting
export const formatError = (error) => {
 console.log('[API] Formatting error:', error);
 
 // Special case for duplicate user error
 if (error.status === 400 && error.data?.message?.includes('already exists')) {
   return {
     status: error.status,
     message: 'Cet email est déjà utilisé. Veuillez utiliser un autre email ou vous connecter.',
     data: error.data,
     originalMessage: error.data.message
   };
 }
 
 // Rate limiting errors
 if (error.status === 429) {
   return {
     status: error.status,
     message: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques secondes.',
     isRateLimited: true,
     data: error.data || {}
   };
 }
 
 // Unauthorized errors
 if (error.status === 401) {
   // Try to remove invalid tokens
   removeAuthToken();
   
   return {
     status: error.status,
     message: 'Votre session a expiré. Veuillez vous reconnecter.',
     isAuthError: true,
     data: error.data || {}
   };
 }
 
 // If it's already our format, return it
 if (error.status && (error.data || error.message)) {
   return error;
 }

 // Network errors
 if (error.message && !error.status) {
   return {
     status: 0,
     message: error.message || 'Impossible de se connecter au serveur',
     isNetworkError: true
   };
 }

 // Default error
 return {
   status: error.status || 500,
   message: error.message || 'Une erreur inconnue est survenue',
   data: error.data || {}
 };
};

// Get cached response if available
const getCachedResponse = (requestKey) => {
 // Check memory cache first
 if (requestCache[requestKey]) {
   const { data, timestamp } = requestCache[requestKey];
   // Cache is valid for 5 minutes
   if (Date.now() - timestamp < 5 * 60 * 1000) {
     return data;
   }
 }
 
 // Try localStorage cache as fallback
 try {
   const cachedData = localStorage.getItem(`api-cache-${requestKey}`);
   if (cachedData) {
     const parsed = JSON.parse(cachedData);
     // Update memory cache
     requestCache[requestKey] = {
       data: parsed,
       timestamp: Date.now()
     };
     return parsed;
   }
 } catch (e) {
   console.warn('[API] Error reading from localStorage cache', e);
 }
 
 return null;
};

// Modified apiRequest function to ensure token is included properly
export const apiRequest = async (endpoint, options = {}, retries = 1) => {
 const url = `${API_BASE_URL}${endpoint}`;
 const requestKey = `${options.method || 'GET'}-${endpoint}`;
 
 // Add throttling check to prevent rate limiting
 const now = Date.now();
 if (requestTimestamps[requestKey] && (now - requestTimestamps[requestKey] < REQUEST_THROTTLE)) {
   console.log(`[API] Throttling request to: ${requestKey}`);
   
   // Return cached response if available
   const cachedData = getCachedResponse(requestKey);
   if (cachedData) {
     console.log('[API] Using cached response for throttled request');
     return cachedData;
   }
   
   // If no cache available, wait before making request
   const waitTime = REQUEST_THROTTLE - (now - requestTimestamps[requestKey]);
   console.log(`[API] Waiting ${waitTime}ms before making request`);
   await new Promise(resolve => setTimeout(resolve, waitTime));
 }
 
 // Update timestamp before making request
 requestTimestamps[requestKey] = now;

 // Ensure headers are properly set with auth token
 if (!options.headers) {
   options.headers = {};
 }
 
 if (options.headers['Content-Type'] === undefined) {
   options.headers['Content-Type'] = 'application/json';
 }

 // Always add auth token if not explicitly disabled
 if (options.authenticated !== false) {
   const token = getAuthToken();
   if (token) {
     options.headers['Authorization'] = `Bearer ${token}`;
     console.log('[API] Auth token added to request headers');
   }
 }
 
 console.log(`[API] Request: ${options.method || 'GET'} ${url}`);
 
 // Debug auth token
 if (options.headers && options.headers['Authorization']) {
   const authHeader = options.headers['Authorization'];
   console.log('[API] Auth token included:', authHeader.startsWith('Bearer ') ? 'Yes (Bearer token)' : 'Yes (format unknown)');
   
   // Check if token looks valid
   if (authHeader.startsWith('Bearer ')) {
     const token = authHeader.substring(7);
     const isLikelyValid = isTokenLikelyValid(token);
     console.log('[API] Token appears valid:', isLikelyValid);
   }
 } else {
   console.log('[API] Auth token included: No');
 }
 
 if (options.body) {
   try {
     console.log('[API] Request payload:', JSON.parse(options.body));
   } catch (e) {
     console.log('[API] Request payload: (unparseable)', options.body);
   }
 }
 
 try {
   const response = await fetch(url, options);
   console.log(`[API] Response status: ${response.status}`);
   
   // Handle rate limiting (429) with cache
   if (response.status === 429) {
     console.warn('[API] Rate limit reached (429)');
     
     // Return cached response if available
     const cachedData = getCachedResponse(requestKey);
     if (cachedData) {
       console.log('[API] Using cached response for rate-limited request');
       return cachedData;
     }
     
     // If we have retries left and no cache, wait and retry
     if (retries > 0) {
       console.log(`[API] Will retry after delay, ${retries} retries left`);
       await new Promise(resolve => setTimeout(resolve, 2000));
       return apiRequest(endpoint, options, retries - 1);
     }
     
     // No retries left and no cache, throw rate limit error
     throw {
       status: 429,
       message: 'Rate limit exceeded'
     };
   }
   
   const contentType = response.headers.get('content-type');
   
   let data;
   if (contentType && contentType.includes('application/json')) {
     data = await response.json();
     console.log('[API] Response data:', data);
   } else {
     const text = await response.text();
     console.warn('[API] Response is not JSON:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
     try {
       data = JSON.parse(text);
     } catch (e) {
       data = { message: text || 'No response data' };
     }
   }
   
   if (!response.ok) {
     console.error(`[API] Request failed with status ${response.status}`);
     
     // Special handling for 401 unauthorized
     if (response.status === 401 && retries > 0) {
       console.log('[API] 401 error, removing token and will retry', retries);
       // Clear potentially invalid token
       removeAuthToken();
       
       // Redirect to login if we're in a browser context
       if (typeof window !== 'undefined') {
         console.log('[API] Redirecting to login after 401 error');
         window.location.href = '/login';
       }
     }
     
     const error = {
       status: response.status,
       message: data.message || `API error: ${response.status}`,
       data
     };
     throw error;
   }
   
   // Cache successful response
   try {
     // Memory cache
     requestCache[requestKey] = {
       data,
       timestamp: Date.now()
     };
     
     // LocalStorage cache
     localStorage.setItem(`api-cache-${requestKey}`, JSON.stringify(data));
   } catch (e) {
     console.warn('[API] Failed to cache response', e);
   }
   
   return data;
 } catch (error) {
   // Network error and we have retries left
   if (error.message && error.message.includes('fetch') && retries > 0) {
     console.log(`[API] Network error, retrying... (${retries} retries left)`);
     // Wait a bit before retrying
     await new Promise(r => setTimeout(r, 1000));
     return apiRequest(endpoint, options, retries - 1);
   }
   
   // Format and throw standardized error
   const formattedError = formatError(error);
   console.error('[API] Request failed:', formattedError);
   throw formattedError;
 }
};

// Clear API cache for a specific endpoint or all endpoints
export const clearApiCache = (endpoint = null) => {
 if (endpoint) {
   // Clear specific endpoint caches
   const keys = Object.keys(requestCache).filter(key => key.includes(endpoint));
   keys.forEach(key => {
     delete requestCache[key];
     try {
       localStorage.removeItem(`api-cache-${key}`);
     } catch (e) {
       console.warn('[API] Error removing from localStorage', e);
     }
   });
 } else {
   // Clear all API caches
   Object.keys(requestCache).forEach(key => {
     delete requestCache[key];
   });
   
   // Clear localStorage caches
   if (typeof window !== 'undefined') {
     const localStorageKeys = [];
     for (let i = 0; i < localStorage.length; i++) {
       const key = localStorage.key(i);
       if (key && key.startsWith('api-cache-')) {
         localStorageKeys.push(key);
       }
     }
     
     localStorageKeys.forEach(key => {
       try {
         localStorage.removeItem(key);
       } catch (e) {
         console.warn('[API] Error removing from localStorage', e);
       }
     });
   }
 }
 
 console.log('[API] Cache cleared', endpoint ? `for ${endpoint}` : 'for all endpoints');
};

export const api = {
 get: async (endpoint, authenticated = true) => {
   return apiRequest(endpoint, {
     method: 'GET',
     headers: getHeaders(authenticated),
     authenticated: authenticated
   });
 },

 post: async (endpoint, data, authenticated = true) => {
   return apiRequest(endpoint, {
     method: 'POST',
     headers: getHeaders(authenticated),
     body: JSON.stringify(data),
     authenticated: authenticated
   });
 },

 put: async (endpoint, data, authenticated = true) => {
   return apiRequest(endpoint, {
     method: 'PUT',
     headers: getHeaders(authenticated),
     body: JSON.stringify(data),
     authenticated: authenticated
   });
 },

 delete: async (endpoint, authenticated = true) => {
   return apiRequest(endpoint, {
     method: 'DELETE',
     headers: getHeaders(authenticated),
     authenticated: authenticated
   });
 },
 
 // Direct token validation
 validateToken: async () => {
   const token = getAuthToken();
   if (!token) return false;
   
   try {
     // Check if token is in valid format
     if (!isTokenLikelyValid(token)) {
       console.warn('[AUTH] Token appears invalid, removing');
       removeAuthToken();
       return false;
     }
     
     // Use lightweight endpoint to validate token
     const response = await fetch(`${API_BASE_URL}/users/validate-token`, {
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       }
     });
     
     if (!response.ok) {
       console.warn('[AUTH] Token validation failed, removing token');
       removeAuthToken();
       return false;
     }
     
     return true;
   } catch (error) {
     console.error('[AUTH] Error validating token:', error);
     return false;
   }
 },
 
 // Clear API cache
 clearCache: clearApiCache
};

export default api;