import api from './api';

const settingsService = {
  getSettings: () => api.get('/settings').then((r) => r.data),
  updateSettings: (payload) => api.put('/settings', payload).then((r) => r.data),
  getBanners: (params) => api.get('/settings/banners', { params }).then((r) => r.data),
  createBanner: (payload) => api.post('/settings/banners', payload).then((r) => r.data),
  updateBanner: (id, payload) => api.put(`/settings/banners/${id}`, payload).then((r) => r.data),
  deleteBanner: (id) => api.delete(`/settings/banners/${id}`).then((r) => r.data),
};

export default settingsService;
