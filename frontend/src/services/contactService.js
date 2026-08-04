import api from './api';

const contactService = {
  sendMessage: (payload) => api.post('/contact', payload).then((r) => r.data),
  getContacts: (params) => api.get('/contact', { params }).then((r) => r.data),
  updateStatus: (id, status) => api.put(`/contact/${id}/status`, { status }).then((r) => r.data),
};

export default contactService;
