// src/services/orderService.js
import api from '../utils/api/apiUtils';

// Request throttling variables
let lastOrderRequest = 0;
const REQUEST_COOLDOWN = 5000; // 5 seconds minimum between order requests

/**
 * Order Service - Handles order creation, retrieval, and management
 */
const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @param {Array} orderData.orderItems - List of order items (product id and quantity)
   * @param {Object} orderData.shippingAddress - Shipping address information
   * @returns {Promise<Object>} Created order
   */
  createOrder: async (orderData) => {
    try {
      console.log('[ORDER] Creating order with payload:', orderData);
      
      // Check if we have a valid token before making the request
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      if (!token) {
        console.warn('[ORDER] No auth token available for order creation');
        throw { status: 401, message: 'Authentication required' };
      }
      
      // Try using the full path to ensure we're hitting the right endpoint
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      // Better error handling
      if (!response.ok) {
        const status = response.status;
        console.error(`[ORDER] Order creation failed with status: ${status}`);
        
        let errorData = {};
        try {
          errorData = await response.json().catch(() => ({}));
        } catch (e) {
          console.warn('[ORDER] Could not parse error response as JSON');
        }
        
        throw { 
          status, 
          message: errorData.message || `Order creation failed (${status})`,
          data: errorData
        };
      }
      
      const result = await response.json();
      console.log('[ORDER] Order created successfully:', result);
      return result;
    } catch (error) {
      console.error('[ORDER] Create order error:', error);
      throw error;
    }
  },

  /**
   * Get all orders for the current user
   * @returns {Promise<Array>} List of user's orders
   */
  getMyOrders: async () => {
    try {
      // Check for rate limiting
      const now = Date.now();
      if (now - lastOrderRequest < REQUEST_COOLDOWN) {
        console.log('[ORDER] Request throttled, using cached data');
        // Try to return cached data
        try {
          const cachedData = localStorage.getItem('cached-orders');
          if (cachedData) {
            return JSON.parse(cachedData);
          }
        } catch (e) {
          console.warn('[ORDER] Error reading cached orders', e);
        }
        return [];
      }
      
      // Update timestamp before making request
      lastOrderRequest = now;
      
      console.log('[ORDER] Requesting my orders');
      // Verify token presence for debugging
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      console.log('[ORDER] Token available for orders request:', !!token);
      
      // Try to get response with limited retries
      let response;
      try {
        response = await api.get('/orders/myorders');
      } catch (error) {
        console.error('[ORDER] Failed to fetch orders:', error);
        // If there's a status code and it's 429 (rate limit)
        if (error.status === 429) {
          console.warn('[ORDER] Rate limit reached, using cached data');
          // Try to return cached data
          try {
            const cachedData = localStorage.getItem('cached-orders');
            if (cachedData) {
              return JSON.parse(cachedData);
            }
          } catch (e) {
            console.warn('[ORDER] Error reading cached orders', e);
          }
        }
        return [];
      }
      
      // Ensure we return an array even if the response is null or undefined
      if (!response) {
        console.warn('[ORDER] No response data from orders API, returning empty array');
        return [];
      }
      
      if (!Array.isArray(response)) {
        console.warn('[ORDER] Response is not an array, converting to array:', response);
        response = Array.isArray(response.orders) ? response.orders : [response];
      }
      
      console.log('[ORDER] Retrieved orders:', response.length);
      
      // Cache successful response
      try {
        localStorage.setItem('cached-orders', JSON.stringify(response));
      } catch (e) {
        console.warn('[ORDER] Failed to cache orders', e);
      }
      
      return response;
    } catch (error) {
      console.error('[ORDER] Get my orders error:', error);
      // Return empty array instead of throwing to prevent component failures
      return [];
    }
  },

  /**
   * Get a specific order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  getOrderById: async (orderId) => {
    try {
      if (!orderId) {
        console.error('[ORDER] Get order error: No order ID provided');
        throw new Error('ID de commande manquant');
      }
      
      console.log('[ORDER] Fetching order details for:', orderId);
      
      // Try to get from cache first
      try {
        const cachedOrders = localStorage.getItem('cached-orders');
        if (cachedOrders) {
          const orders = JSON.parse(cachedOrders);
          const cachedOrder = orders.find(o => o._id === orderId);
          if (cachedOrder) {
            console.log('[ORDER] Using cached order data');
            return cachedOrder;
          }
        }
      } catch (e) {
        console.warn('[ORDER] Error reading from cache', e);
      }
      
      const result = await api.get(`/orders/${orderId}`);
      
      if (!result) {
        throw new Error('Commande non trouvée');
      }
      
      return result;
    } catch (error) {
      console.error('[ORDER] Get order error:', error);
      throw new Error(error.message || 'Impossible de récupérer les détails de la commande.');
    }
  },

  /**
   * Update order to paid status
   * @param {string} orderId - Order ID
   * @param {Object} paymentResult - Payment result from payment processor
   * @returns {Promise<Object>} Updated order
   */
  updateOrderToPaid: async (orderId, paymentResult) => {
    try {
      return await api.put(`/orders/${orderId}/pay`, paymentResult);
    } catch (error) {
      console.error('[ORDER] Update order to paid error:', error);
      throw new Error(error.message || 'Impossible de traiter le paiement.');
    }
  },
  
  /**
   * Mark an order as delivered
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Updated order
   */
  deliverOrder: async (orderId) => {
    try {
      return await api.put(`/orders/${orderId}/deliver`, {});
    } catch (error) {
      console.error('[ORDER] Deliver order error:', error);
      throw new Error(error.message || 'Impossible de marquer la commande comme livrée.');
    }
  },

  /**
   * Calculate order summary
   * @param {Array} orders - List of orders
   * @returns {Object} Order summary with total orders, total amount, etc.
   */
  calculateOrderSummary: (orders) => {
    // Ensure orders is an array to prevent errors
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      console.log('[ORDER] calculateOrderSummary: No orders or invalid data, returning defaults');
      return {
        totalOrders: 0,
        totalAmount: 0,
        paidOrders: 0,
        unPaidOrders: 0,
        deliveredOrders: 0,
        pendingDelivery: 0
      };
    }
    
    try {
      const summary = {
        totalOrders: orders.length,
        totalAmount: orders.reduce((sum, order) => {
          // Add defensive check for totalPrice
          const price = order && typeof order.totalPrice === 'number' ? order.totalPrice : 0;
          return sum + price;
        }, 0),
        paidOrders: orders.filter(order => order && order.isPaid).length,
        unPaidOrders: orders.filter(order => order && !order.isPaid).length,
        deliveredOrders: orders.filter(order => order && order.isDelivered).length,
        pendingDelivery: orders.filter(order => order && !order.isDelivered).length,
      };
      
      console.log('[ORDER] Order summary calculated:', summary);
      return summary;
    } catch (error) {
      console.error('[ORDER] Error calculating order summary:', error);
      // Return default summary on error
      return {
        totalOrders: orders.length || 0,
        totalAmount: 0,
        paidOrders: 0,
        unPaidOrders: 0,
        deliveredOrders: 0,
        pendingDelivery: 0
      };
    }
  },

  /**
   * Get order status label
   * @param {Object} order - Order object
   * @returns {string} Status label in French
   */
  getOrderStatusLabel: (order) => {
    if (!order) return 'Inconnu';
    
    if (order.isDelivered) return 'Livré';
    if (order.isShipped) return 'Expédié';
    if (order.isPaid) return 'En cours';
    return 'En attente';
  },

  /**
   * Format order date for display
   * @param {string|Date} dateString - Date string or Date object
   * @returns {string} Formatted date
   */
  formatOrderDate: (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('[ORDER] Error formatting date:', error);
      return String(dateString);
    }
  },

  /**
   * Verify Stripe session status
   * @param {string} sessionId - Stripe checkout session ID
   * @returns {Promise<Object>} Session verification result
   */
  verifyStripeSession: async (sessionId) => {
    try {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }
      
      console.log('[ORDER] Verifying Stripe session:', sessionId);
      
      // Call our own API endpoint that verifies the session with Stripe
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiBase}/payments/verify-session?session_id=${sessionId}`);
      
      if (!response.ok) {
        const status = response.status;
        let errorMessage = `Session verification failed (${status})`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.warn('[ORDER] Could not parse error response from session verification');
        }
        
        throw new Error(errorMessage);
      }
      
      const sessionData = await response.json();
      console.log('[ORDER] Session verified:', sessionData);
      
      return sessionData;
    } catch (error) {
      console.error('[ORDER] Session verification error:', error);
      throw new Error(error.message || 'Impossible de vérifier le statut du paiement');
    }
  },
  
  /**
   * Get order details from Stripe session
   * @param {string} sessionId - Stripe checkout session ID
   * @returns {Promise<Object>} Order details if available
   */
  getOrderBySessionId: async (sessionId) => {
    try {
      // First verify the session
      const sessionData = await orderService.verifyStripeSession(sessionId);
      
      // If we have an orderId in the metadata, fetch the order details
      if (sessionData.metadata && sessionData.metadata.orderId) {
        try {
          const order = await orderService.getOrderById(sessionData.metadata.orderId);
          return {
            ...order,
            paymentStatus: sessionData.status,
            stripeSessionData: sessionData
          };
        } catch (orderError) {
          console.error('[ORDER] Could not fetch order from session metadata:', orderError);
          // Return basic session data if order fetch fails
          return {
            _id: sessionData.metadata.orderId,
            paymentStatus: sessionData.status,
            totalPrice: sessionData.amount_total / 100,
            createdAt: new Date().toISOString(),
            stripeSessionData: sessionData
          };
        }
      }
      
      // If no orderId in metadata, return session data as basic order info
      return {
        _id: sessionId,
        paymentStatus: sessionData.status,
        totalPrice: sessionData.amount_total / 100,
        customerEmail: sessionData.customer_details?.email,
        createdAt: new Date().toISOString(),
        stripeSessionData: sessionData
      };
    } catch (error) {
      console.error('[ORDER] Error getting order from session:', error);
      throw new Error(error.message || 'Could not retrieve order information');
    }
  }
};

export default orderService;