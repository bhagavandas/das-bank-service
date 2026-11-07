import apiClient from './apiClient';

export const authService = {
  async register(username, password) {
    const response = await apiClient.post('/auth/register', { username, password });
    return response.data;
  },

  async login(username, password) {
    const response = await apiClient.post('/auth/login', { username, password });
    const { token, tokenType, username: user } = response.data;
    if (token) {
      localStorage.setItem('bank_auth_token', token);
      localStorage.setItem('bank_auth_user', user || username);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('bank_auth_token');
    localStorage.removeItem('bank_auth_user');
  },

  getCurrentUser() {
    return localStorage.getItem('bank_auth_user');
  },

  getToken() {
    return localStorage.getItem('bank_auth_token');
  },

  async checkHealth() {
    try {
      const response = await apiClient.get('/actuator/health', {
        baseURL: import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '',
      });
      return response.data;
    } catch {
      return null;
    }
  },
};

