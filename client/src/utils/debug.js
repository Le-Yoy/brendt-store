// src/utils/debug.js

/**
 * Debug utility for checking API endpoints and connections
 * Only active in development mode
 */
export const checkApiEndpoints = () => {
  if (typeof window === 'undefined') return;
  
  // Only run in development
  if (process.env.NODE_ENV !== 'development') return;
  
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://brendt-store-production-d6ef.up.railway.app/api';
  console.log('[DEBUG] API Base URL:', apiBase);
  
  // List expected endpoints
  const endpoints = [
    `${apiBase}/orders`,
    `${apiBase}/users/profile`,
    `${apiBase}/products`
  ];
  
  console.log('[DEBUG] Expected API endpoints:');
  endpoints.forEach(endpoint => console.log(` - ${endpoint}`));
  
  // Check authentication token
  const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
  console.log('[DEBUG] Auth token available:', !!token);
  if (token) {
    const tokenParts = token.split('.');
    console.log('[DEBUG] Token format valid:', tokenParts.length === 3);
    
    // Check token expiration
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        if (payload.exp) {
          const expiryTime = payload.exp * 1000; // convert to milliseconds
          const now = Date.now();
          console.log('[DEBUG] Token expired:', expiryTime < now);
          if (expiryTime > now) {
            const timeRemaining = new Date(expiryTime - now);
            console.log('[DEBUG] Token expires in:', 
              `${Math.floor(timeRemaining / (1000 * 60 * 60))}h ${Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))}m`);
          }
        }
      } catch (e) {
        console.error('[DEBUG] Error parsing token payload:', e);
      }
    }
  }
  
  // Add a ping test for the orders endpoint
  fetch(`${apiBase}/orders/ping`, { 
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })
    .then(response => {
      console.log('[DEBUG] API orders ping test:', response.status === 200 ? 'Success' : `Failed (${response.status})`);
    })
    .catch(error => {
      console.error('[DEBUG] API orders ping test failed:', error);
    });
    
  // Try to access the base API to check if server is running
  fetch(`${apiBase}`, { method: 'GET' })
    .then(response => {
      console.log('[DEBUG] API base URL test:', response.status === 200 ? 'Success' : `Failed (${response.status})`);
    })
    .catch(error => {
      console.error('[DEBUG] API base URL test failed:', error);
      console.warn('[DEBUG] Backend server may not be running or is inaccessible');
    });
    
  // Check CORS configuration
  const corsHeaders = new Headers();
  corsHeaders.append('Content-Type', 'application/json');
  if (token) corsHeaders.append('Authorization', `Bearer ${token}`);
  
  fetch(`${apiBase}/ping`, { 
    method: 'OPTIONS',
    headers: corsHeaders
  })
    .then(response => {
      console.log('[DEBUG] CORS preflight test:', response.ok ? 'Success' : `Failed (${response.status})`);
    })
    .catch(error => {
      console.error('[DEBUG] CORS preflight test failed:', error);
    });
};

/**
 * Debug utility for checking order submission
 * Call this function before submitting an order to check everything is set up correctly
 */
export const debugOrderSubmission = (orderData) => {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'development') return;
  
  console.log('[DEBUG] Order submission check:');
  
  // Check authentication
  const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
  console.log('[DEBUG] Auth token for order submission:', !!token);
  
  // Check order data
  console.log('[DEBUG] Order data validity:');
  console.log(' - Has order items:', orderData && Array.isArray(orderData.orderItems) && orderData.orderItems.length > 0);
  console.log(' - Has shipping address:', orderData && orderData.shippingAddress && typeof orderData.shippingAddress === 'object');
  console.log(' - Has payment method:', orderData && orderData.paymentMethod);
  console.log(' - Has total price:', orderData && typeof orderData.totalPrice === 'number');
  
  // Try a preflight request to the orders endpoint
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://brendt-store-production-d6ef.up.railway.app/api';
  fetch(`${apiBase}/orders`, {
    method: 'OPTIONS',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })
    .then(response => {
      console.log('[DEBUG] Order endpoint preflight check:', response.ok ? 'Success' : `Failed (${response.status})`);
    })
    .catch(error => {
      console.error('[DEBUG] Order endpoint preflight check failed:', error);
    });
};

export default { checkApiEndpoints, debugOrderSubmission };