import api from './api';

const paymentService = {
  createRazorpayOrder: (orderId) => api.post('/payments/create-order', { orderId }).then((r) => r.data),
  verifyPayment: (payload) => api.post('/payments/verify', payload).then((r) => r.data),
  refundPayment: (payload) => api.post('/payments/refund', payload).then((r) => r.data),
};

export default paymentService;
