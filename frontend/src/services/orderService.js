import api from './api';

const orderService = {
  createOrder: (payload) => api.post('/orders', payload).then((r) => r.data),
  getOrders: (params) => api.get('/orders', { params }).then((r) => r.data),
  getOrder: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  updateOrderStatus: (id, payload) => api.put(`/orders/${id}/status`, payload).then((r) => r.data),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }).then((r) => r.data),
};

export default orderService;
