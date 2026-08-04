import api from './api';

const numberService = {
  getNumbers: (params) => api.get('/numbers', { params }).then((r) => r.data),
  getNumber: (id) => api.get(`/numbers/${id}`).then((r) => r.data),
  suggest: (q) => api.get('/numbers/search/suggest', { params: { q } }).then((r) => r.data),
  createNumber: (payload) => api.post('/numbers', payload).then((r) => r.data),
  updateNumber: (id, payload) => api.put(`/numbers/${id}`, payload).then((r) => r.data),
  deleteNumber: (id) => api.delete(`/numbers/${id}`).then((r) => r.data),
};

export default numberService;
