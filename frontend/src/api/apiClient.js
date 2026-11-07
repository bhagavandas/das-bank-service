import axios from 'axios';

// Base API client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bank_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting and auth expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // If 401 Unauthorized, dispatch event for logout
      if (error.response.status === 401) {
        window.dispatchEvent(new CustomEvent('bank:unauthorized'));
      }
      const data = error.response.data;
      const message =
        (typeof data === 'string' ? data : data?.message || data?.error || JSON.stringify(data)) ||
        error.message;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(
        new Error('Unable to reach backend gateway (port 9080). Make sure backend services are running.')
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;

