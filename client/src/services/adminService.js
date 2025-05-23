// src/services/adminService.js

import api from '../utils/api/apiUtils';

/**
 * Admin Service - Handles admin-specific operations including user management,
 * order management, inventory approvals, notifications, form submissions, and analytics.
 */
const adminService = {
  /**
   * Get all users (admin only).
   * @returns {Promise<Array>} List of all users.
   */
  getUsers: async () => {
    try {
      const response = await api.get('/api/admin/users');
      return response;
    } catch (error) {
      console.error('[ADMIN] Get users error:', error);
      throw error;
    }
  },

  /**
   * Create a new user (admin only).
   * @param {Object} userData - User data.
   * @returns {Promise<Object>} Created user.
   */
  createUser: async (userData) => {
    try {
      return await api.post('/api/admin/users', userData);
    } catch (error) {
      console.error('[ADMIN] Create user error:', error);
      throw error;
    }
  },

  /**
   * Get a specific user by ID (admin only).
   * @param {string} userId - User ID.
   * @returns {Promise<Object>} User details.
   */
  getUserById: async (userId) => {
    try {
      return await api.get(`/api/admin/users/${userId}`);
    } catch (error) {
      console.error('[ADMIN] Get user error:', error);
      throw error;
    }
  },

  /**
   * Update a user's information (admin only).
   * @param {string} userId - User ID.
   * @param {Object} userData - Updated user data.
   * @returns {Promise<Object>} Updated user.
   */
  updateUser: async (userId, userData) => {
    try {
      return await api.put(`/api/admin/users/${userId}`, userData);
    } catch (error) {
      console.error('[ADMIN] Update user error:', error);
      throw error;
    }
  },

  /**
   * Delete a user (admin only).
   * @param {string} userId - User ID.
   * @returns {Promise<Object>} Deletion result.
   */
  deleteUser: async (userId) => {
    try {
      return await api.delete(`/api/admin/users/${userId}`);
    } catch (error) {
      console.error('[ADMIN] Delete user error:', error);
      throw error;
    }
  },

  /**
   * Get all products (admin view)
   * @returns {Promise<Array>} List of products
   */
  getProducts: async () => {
    try {
      return await api.get('/api/admin/products');
    } catch (error) {
      console.error('[ADMIN] Get products error:', error);
      throw error;
    }
  },

  /**
   * Create a new product (admin only).
   * @param {Object} productData - Product data.
   * @returns {Promise<Object>} Created product.
   */
  createProduct: async (productData) => {
    try {
      return await api.post('/api/admin/products', productData);
    } catch (error) {
      console.error('[ADMIN] Create product error:', error);
      throw error;
    }
  },

  /**
   * Update a product (admin only).
   * @param {string} productId - Product ID.
   * @param {Object} productData - Updated product data.
   * @returns {Promise<Object>} Updated product.
   */
  updateProduct: async (productId, productData) => {
    try {
      return await api.put(`/api/admin/products/${productId}`, productData);
    } catch (error) {
      console.error('[ADMIN] Update product error:', error);
      throw error;
    }
  },

  /**
   * Delete a product (admin only).
   * @param {string} productId - Product ID.
   * @returns {Promise<Object>} Deletion result.
   */
  deleteProduct: async (productId) => {
    try {
      return await api.delete(`/api/admin/products/${productId}`);
    } catch (error) {
      console.error('[ADMIN] Delete product error:', error);
      throw error;
    }
  },

  /**
   * Get all categories (admin only).
   * @returns {Promise<Array>} List of categories.
   */
  getCategories: async () => {
    try {
      return await api.get('/api/admin/categories');
    } catch (error) {
      console.error('[ADMIN] Get categories error:', error);
      throw error;
    }
  },

  /**
   * Get all orders (admin only).
   * @returns {Promise<Array>} List of all orders.
   */
  getOrders: async () => {
    try {
      return await api.get('/api/admin/orders');
    } catch (error) {
      console.error('[ADMIN] Get orders error:', error);
      throw error;
    }
  },

  /**
   * Get all orders (legacy method - use getOrders instead).
   * @returns {Promise<Array>} List of all orders.
   * @deprecated Use getOrders instead.
   */
  getAllOrders: async () => {
    try {
      const response = await api.get('/api/orders');
      return response.data.orders || [];
    } catch (error) {
      console.error('Get all orders error:', error);
      throw error;
    }
  },

  /**
   * Update order status (admin only)
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  updateOrderStatus: async (orderId, statusData) => {
    try {
      console.log(`[ADMIN] Updating order ${orderId} status:`, statusData);
      const response = await api.put(`/api/admin/orders/${orderId}/status`, statusData);
      return response;
    } catch (error) {
      console.error('[ADMIN] Update order status error:', error);
      throw error;
    }
  },

  /**
   * Update order to delivered status (admin only).
   * @param {string} orderId - Order ID.
   * @returns {Promise<Object>} Updated order.
   */
  updateOrderToDelivered: async (orderId) => {
    try {
      return await api.put(`/api/orders/${orderId}/deliver`, {});
    } catch (error) {
      console.error('Update order to delivered error:', error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics (admin only)
   * @returns {Promise<Object>} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      console.log('[ADMIN] Fetching dashboard stats...');
      const response = await api.get('/api/admin/stats');
      console.log('[ADMIN] Dashboard stats fetched:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Get stats error:', error);
      throw error;
    }
  },

  /**
   * Get sales analytics data.
   * @param {string} [period='monthly'] - Analytics period.
   * @returns {Promise<Object>} Sales analytics data.
   */
  getSalesAnalytics: async (period = 'monthly') => {
    try {
      return await api.get(`/api/admin/analytics/sales?period=${period}`);
    } catch (error) {
      console.error('Get sales analytics error:', error);
      throw error;
    }
  },

  /**
   * Get customer analytics data.
   * @returns {Promise<Object>} Customer analytics data.
   */
  getCustomerAnalytics: async () => {
    try {
      return await api.get('/api/admin/analytics/customers');
    } catch (error) {
      console.error('Get customer analytics error:', error);
      throw error;
    }
  },

  /**
   * Get product performance analytics.
   * @returns {Promise<Object>} Product performance data.
   */
  getProductAnalytics: async () => {
    try {
      return await api.get('/api/admin/analytics/products');
    } catch (error) {
      console.error('Get product analytics error:', error);
      throw error;
    }
  },

  /**
   * Get all inventory logs.
   * @returns {Promise<Object>} Inventory logs data.
   */
  getInventoryLogs: async () => {
    try {
      return await api.get('/api/admin/inventory');
    } catch (error) {
      console.error('Get inventory logs error:', error);
      throw error;
    }
  },

  /**
   * Create an inventory log (admin only).
   * @param {Object} logData - Inventory log data.
   * @returns {Promise<Object>} Created inventory log.
   */
  createInventoryLog: async (logData) => {
    try {
      return await api.post('/api/admin/inventory', logData);
    } catch (error) {
      console.error('[ADMIN] Create inventory log error:', error);
      throw error;
    }
  },

  /**
   * Approve an inventory log (admin only).
   * @param {string} id - Inventory log ID.
   * @param {string} comment - Optional approval comment.
   * @returns {Promise<Object>} Updated inventory log.
   */
  approveInventoryLog: async (id, comment) => {
    try {
      return await api.put(`/api/admin/inventory/${id}/approve`, { comment });
    } catch (error) {
      console.error('Approve inventory log error:', error);
      throw error;
    }
  },

  /**
   * Reject an inventory log (admin only).
   * @param {string} id - Inventory log ID.
   * @param {string} comment - Optional rejection comment.
   * @returns {Promise<Object>} Updated inventory log.
   */
  rejectInventoryLog: async (id, comment) => {
    try {
      return await api.put(`/api/admin/inventory/${id}/reject`, { comment });
    } catch (error) {
      console.error('Reject inventory log error:', error);
      throw error;
    }
  },

  /**
   * Get notifications for the admin.
   * @returns {Promise<Object>} Notifications data.
   */
  getNotifications: async () => {
    try {
      return await api.get('/api/admin/notifications');
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  /**
   * Mark a notification as read.
   * @param {string} id - Notification ID.
   * @returns {Promise<Object>} Updated notification.
   */
  markNotificationAsRead: async (id) => {
    try {
      return await api.put(`/api/admin/notifications/${id}/read`);
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

  /**
   * Get all form submissions.
   * @returns {Promise<Object>} Form submissions data.
   */
  getForms: async () => {
    try {
      return await api.get('/api/admin/forms');
    } catch (error) {
      console.error('Get forms error:', error);
      throw error;
    }
  },

  /**
   * Update a form submission (admin only).
   * @param {string} id - Form submission ID.
   * @param {Object} data - Updated form data.
   * @returns {Promise<Object>} Updated form submission.
   */
  updateForm: async (id, data) => {
    try {
      return await api.put(`/api/admin/forms/${id}`, data);
    } catch (error) {
      console.error('Update form error:', error);
      throw error;
    }
  },

  /**
   * Promote a user to admin.
   * @param {string} id - User ID.
   * @returns {Promise<Object>} Updated user data.
   */
  promoteToAdmin: async (id) => {
    try {
      return await api.put(`/api/admin/promote/${id}`);
    } catch (error) {
      console.error('Promote to admin error:', error);
      throw error;
    }
  },

  /**
   * Get customer interactions (admin only)
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer interactions
   */
  getCustomerInteractions: async (customerId) => {
    try {
      return await api.get(`/api/admin/customers/${customerId}/interactions`);
    } catch (error) {
      console.error('[ADMIN] Get customer interactions error:', error);
      throw error;
    }
  },

  /**
   * Get customer order history (admin only)
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>} Customer order history
   */
  getCustomerOrderHistory: async (customerId) => {
    try {
      return await api.get(`/api/admin/customers/${customerId}/orders`);
    } catch (error) {
      console.error('[ADMIN] Get customer order history error:', error);
      throw error;
    }
  },

  /**
   * Get checkout analytics (admin only)
   * @param {string} period - Time period for analytics
   * @returns {Promise<Object>} Checkout analytics data
   */
  getCheckoutAnalytics: async (period = '30d') => {
    try {
      return await api.get(`/api/admin/analytics/checkout?period=${period}`);
    } catch (error) {
      console.error('[ADMIN] Get checkout analytics error:', error);
      throw error;
    }
  },

  /**
   * Get order timeline (admin only)
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order timeline events
   */
  getOrderTimeline: async (orderId) => {
    try {
      return await api.get(`/api/admin/orders/${orderId}/timeline`);
    } catch (error) {
      console.error('[ADMIN] Get order timeline error:', error);
      throw error;
    }
  },

  /**
   * Get order with details (admin only)
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Detailed order information
   */
  getOrderWithDetails: async (orderId) => {
    try {
      return await api.get(`/api/admin/orders/${orderId}/details`);
    } catch (error) {
      console.error('[ADMIN] Get order details error:', error);
      throw error;
    }
  },

  // ====== NEW COLOR STOCK AND PRICE MANAGEMENT METHODS ======

  /**
   * Get products with detailed color information for admin
   * @returns {Promise<Array>} Products with color details
   */
  getProductsWithColorDetails: async () => {
    try {
      console.log('[ADMIN] Fetching products with color details...');
      const response = await api.get('/api/admin/products/colors');
      console.log('[ADMIN] Products with color details fetched:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Get products with color details error:', error);
      throw error;
    }
  },

  /**
   * Update color variant stock
   * @param {string} productId - Product ID
   * @param {number} colorIndex - Color index
   * @param {boolean} inStock - Stock status
   * @returns {Promise<Object>} Updated product
   */
  updateColorStock: async (productId, colorIndex, inStock) => {
    try {
      console.log(`[ADMIN] Updating color stock: Product ${productId}, Color ${colorIndex}, InStock: ${inStock}`);
      const response = await api.put('/api/admin/products/color-stock', {
        productId,
        colorIndex,
        inStock
      });
      console.log('[ADMIN] Color stock updated:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Update color stock error:', error);
      throw error;
    }
  },

  /**
   * Update color variant price
   * @param {string} productId - Product ID
   * @param {number} colorIndex - Color index  
   * @param {number|null} price - New price (null to remove custom price)
   * @returns {Promise<Object>} Updated product
   */
  updateColorPrice: async (productId, colorIndex, price) => {
    try {
      console.log(`[ADMIN] Updating color price: Product ${productId}, Color ${colorIndex}, Price: ${price}`);
      const response = await api.put('/api/admin/products/color-price', {
        productId,
        colorIndex,
        price
      });
      console.log('[ADMIN] Color price updated:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Update color price error:', error);
      throw error;
    }
  },

  /**
   * Update color variant stock with exact number
   * @param {string} productId - Product ID
   * @param {number} colorIndex - Color index
   * @param {number} stock - Stock quantity
   * @returns {Promise<Object>} Updated product
   */
  updateColorStockNumber: async (productId, colorIndex, stock) => {
    try {
      console.log(`[ADMIN] Updating color stock number: Product ${productId}, Color ${colorIndex}, Stock: ${stock}`);
      const response = await api.put('/api/admin/products/color-stock-number', {
        productId,
        colorIndex,
        stock
      });
      console.log('[ADMIN] Color stock number updated:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Update color stock number error:', error);
      throw error;
    }
  },

  /**
   * Batch update color stocks
   * @param {Array} updates - Array of {productId, colorIndex, stock} objects
   * @returns {Promise<Object>} Update results
   */
  batchUpdateColorStocks: async (updates) => {
    try {
      console.log('[ADMIN] Batch updating color stocks:', updates);
      const response = await api.put('/api/admin/products/batch-color-stock', {
        updates
      });
      console.log('[ADMIN] Batch color stocks updated:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Batch update color stocks error:', error);
      throw error;
    }
  },

  /**
   * Get stock movement history for a product
   * @param {string} productId - Product ID
   * @param {number} colorIndex - Color index (optional)
   * @returns {Promise<Object>} Stock movement history
   */
  getStockHistory: async (productId, colorIndex = null) => {
    try {
      console.log(`[ADMIN] Fetching stock history for product ${productId}`);
      const url = colorIndex !== null 
        ? `/api/admin/products/${productId}/stock-history?colorIndex=${colorIndex}`
        : `/api/admin/products/${productId}/stock-history`;
      const response = await api.get(url);
      console.log('[ADMIN] Stock history fetched:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Get stock history error:', error);
      throw error;
    }
  },

  /**
   * Get low stock alerts
   * @param {number} threshold - Stock threshold for alerts
   * @returns {Promise<Object>} Low stock products
   */
  getLowStockAlerts: async (threshold = 10) => {
    try {
      console.log(`[ADMIN] Fetching low stock alerts with threshold ${threshold}`);
      const response = await api.get(`/api/admin/products/low-stock?threshold=${threshold}`);
      console.log('[ADMIN] Low stock alerts fetched:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Get low stock alerts error:', error);
      throw error;
    }
  },

  /**
   * Export stock data to CSV
   * @returns {Promise<Object>} Stock export data
   */
  exportStockData: async () => {
    try {
      console.log('[ADMIN] Exporting stock data...');
      const response = await api.get('/api/admin/products/export-stock');
      console.log('[ADMIN] Stock data exported:', response);
      return response;
    } catch (error) {
      console.error('[ADMIN] Export stock data error:', error);
      throw error;
    }
  },

  /**
   * Get order real-time updates with polling
   * @param {Function} onUpdate - Callback function for updates
   * @returns {Object} Control object with stop method
   */
  getOrdersRealtime: (onUpdate) => {
    console.log('[ADMIN] Setting up real-time order tracking');

    // Initial data fetch
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/admin/orders');
        onUpdate(response.data || []);
      } catch (error) {
        console.error('[ADMIN] Real-time orders fetch error:', error);
      }
    };

    // Set up polling interval for real-time updates
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30 seconds

    // Return control object
    return {
      stop: () => {
        console.log('[ADMIN] Stopping real-time order tracking');
        clearInterval(interval);
      }
    };
  },

  /**
   * Generate mock analytics data for development.
   * @returns {Object} Mock analytics data.
   */
  getMockAnalyticsData: () => {
    return {
      salesSummary: {
        totalSales: 158750.25,
        ordersCount: 423,
        averageOrderValue: 375.30,
        salesGrowth: 12.5,
      },
      salesByPeriod: [
        { period: 'Jan', sales: 12500 },
        { period: 'Feb', sales: 14200 },
        { period: 'Mar', sales: 16800 },
        { period: 'Apr', sales: 15900 },
        { period: 'May', sales: 18200 },
        { period: 'Jun', sales: 21500 },
        { period: 'Jul', sales: 22800 },
        { period: 'Aug', sales: 19700 },
        { period: 'Sep', sales: 17150 },
      ],
      customerMetrics: {
        totalCustomers: 1250,
        newCustomers: 145,
        returningCustomers: 680,
        customerGrowth: 8.3,
        averageLifetimeValue: 825.50,
      },
      topSellingProducts: [
        { id: '1', name: 'Product A', sales: 1250, revenue: 24500 },
        { id: '2', name: 'Product B', sales: 980, revenue: 19600 },
        { id: '3', name: 'Product C', sales: 860, revenue: 17200 },
        { id: '4', name: 'Product D', sales: 720, revenue: 14400 },
        { id: '5', name: 'Product E', sales: 650, revenue: 13000 },
      ],
    };
  },
};

export default adminService;