import api from '../utils/api/apiUtils';

const formService = {
  getForms: async () => {
    return await api.get('/admin/forms');
  },
  updateForm: async (id, data) => {
    return await api.put(`/admin/forms/${id}`, data);
  },
};

export default formService;
