import api from './api';

const couponService = {
  validateCoupon: (code, amount) => api.post('/coupons/validate', { code, amount }).then((r) => r.data),
  getCoupons: () => api.get('/coupons').then((r) => r.data),
  createCoupon: (payload) => api.post('/coupons', payload).then((r) => r.data),
  updateCoupon: (id, payload) => api.put(`/coupons/${id}`, payload).then((r) => r.data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`).then((r) => r.data),
};

export default couponService;
