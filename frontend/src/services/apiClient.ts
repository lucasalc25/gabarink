import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for including the token in every request automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for unified error handling and session management
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        localStorage.removeItem('token');
        // Logic for redirect or session reset can be handled via event or local state
      }
      
      const data = error.response.data as any;
      if (typeof data === 'object' && data !== null) {
        const errorMsg = data.detail || data.message || Object.values(data)[0];
        return Promise.reject(new Error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
