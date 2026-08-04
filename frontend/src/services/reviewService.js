import api from './api';

const reviewService = {
  getReviews: (params) => api.get('/reviews', { params }).then((r) => r.data),
  createReview: (payload) => api.post('/reviews', payload).then((r) => r.data),
  approveReview: (id, payload) => api.put(`/reviews/${id}/approve`, payload).then((r) => r.data),
  deleteReview: (id) => api.delete(`/reviews/${id}`).then((r) => r.data),
};

export default reviewService;
