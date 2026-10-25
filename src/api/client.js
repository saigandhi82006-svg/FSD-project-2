import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alumni_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract clean error message
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    const status = error.response?.status;
    const code = error.response?.data?.code;

    // Handle token expiration
    if (status === 401 && !window.location.pathname.includes('/login')) {
      // Don't auto redirect on landing page
      if (['/', '/about', '/contact', '/directory', '/jobs', '/events'].includes(window.location.pathname)) {
        localStorage.removeItem('alumni_token');
        localStorage.removeItem('alumni_user');
      }
    }

    return Promise.reject({
      message,
      status,
      code,
      details: error.response?.data?.details
    });
  }
);

export default api;
