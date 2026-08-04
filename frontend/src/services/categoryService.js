import api from './api';

const categoryService = {
  getCategories: (params) => api.get('/categories', { params }).then((r) => r.data),
  createCategory: (payload) => api.post('/categories', payload).then((r) => r.data),
  updateCategory: (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};

export default categoryService;
