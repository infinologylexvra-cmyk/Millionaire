import api from './api';

const userService = {
  getProfile: () => api.get('/users/profile').then((r) => r.data),
  updateProfile: (payload) => api.put('/users/profile', payload).then((r) => r.data),
  changePassword: (payload) => api.put('/users/change-password', payload).then((r) => r.data),
  getWishlist: () => api.get('/users/wishlist').then((r) => r.data),
  addToWishlist: (numberId) => api.post(`/users/wishlist/${numberId}`).then((r) => r.data),
  removeFromWishlist: (numberId) => api.delete(`/users/wishlist/${numberId}`).then((r) => r.data),
  addAddress: (payload) => api.post('/users/addresses', payload).then((r) => r.data),
  updateAddress: (id, payload) => api.put(`/users/addresses/${id}`, payload).then((r) => r.data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`).then((r) => r.data),
  getAllUsers: (params) => api.get('/users', { params }).then((r) => r.data),
  updateUserStatus: (id, payload) => api.put(`/users/${id}/status`, payload).then((r) => r.data),
};

export default userService;
