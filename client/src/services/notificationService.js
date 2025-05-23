import api from '../utils/api/apiUtils';

const notificationService = {
  getNotifications: async () => {
    return await api.get('/admin/notifications');
  },
  createNotification: async (data) => {
    return await api.post('/admin/notifications', data);
  },
  markAsRead: async (id) => {
    return await api.put(`/admin/notifications/${id}/read`);
  },
};

export default notificationService;
