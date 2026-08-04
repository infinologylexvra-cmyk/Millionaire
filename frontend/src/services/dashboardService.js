import api from './api';

const dashboardService = {
  getStats: () => api.get('/dashboard').then((r) => r.data),
  getAnalytics: () => api.get('/dashboard/analytics').then((r) => r.data),
};

export default dashboardService;
