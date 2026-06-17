// client/src/services/atelierService.js
// API calls for the atelier operator area (Simo). Uses the shared api client,
// which attaches the auth token. Backend gates these to admin + atelier roles.
import api from '../utils/api/apiUtils';

const atelierService = {
  // Orders the operator can act on.
  getOrders: async () => {
    try {
      return await api.get('/atelier/orders');
    } catch (error) {
      console.error('[ATELIER] getOrders error:', error);
      throw error;
    }
  },

  // Advance an order's status: { status, note?, trackingNumber?, carrier? }
  updateOrderStatus: async (orderId, payload) => {
    try {
      return await api.put(`/atelier/orders/${orderId}/status`, payload);
    } catch (error) {
      console.error('[ATELIER] updateOrderStatus error:', error);
      throw error;
    }
  },

  // Read-only stock (per-color) for the "stock à fabriquer" view.
  getStock: async () => {
    try {
      return await api.get('/atelier/products');
    } catch (error) {
      console.error('[ATELIER] getStock error:', error);
      throw error;
    }
  },

  // Admin-only: generate a single-use signup invite (default role atelier).
  createInvite: async ({ role = 'atelier', email, label } = {}) => {
    try {
      return await api.post('/users/invites', { role, email, label });
    } catch (error) {
      console.error('[ATELIER] createInvite error:', error);
      throw error;
    }
  },
};

export default atelierService;
