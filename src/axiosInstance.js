// src/api/axiosInstance.js
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

let activeRequests = 0;
let startProgressTimeout = null;
let spinnerStartTime = null;
let setGlobalLoading = null;

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const protectedEndpoints = [
  '/api/users',
  '/api/properties',
  '/api/agents',
  '/api/client-briefs',
  '/api/email-templates',
  '/api/email-replies',
  '/api/process-description',
  '/api/buyers-agents',
  '/api/follow-up-tasks',
  '/api/cashflow',
  '/api/send-email',
  '/api/saved-properties',
  '/api/property-conversation',
  '/api/ai-search-queries'
];

export const attachSpinnerInterceptor = (setLoadingFn) => {
  setGlobalLoading = setLoadingFn;
};

// Helper to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    activeRequests++;
    if (activeRequests === 1) {
      startProgressTimeout = setTimeout(() => {
        NProgress.start();
      }, 300);
    }

    spinnerStartTime = Date.now();

    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const requestUrl = new URL(config.url, process.env.REACT_APP_API_BASE_URL).pathname;
    const isProtected = protectedEndpoints.some((endpoint) => requestUrl.startsWith(endpoint));

    if (isProtected && token && isTokenExpired(token)) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh`, {
          refreshToken
        });

        const { newAuthToken } = response.data;
        localStorage.setItem('authToken', newAuthToken);
        config.headers['Authorization'] = `Bearer ${newAuthToken}`;
      } catch (err) {
        console.error('Token refresh failed. Redirecting to login.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    } else if (isProtected && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    clearTimeout(startProgressTimeout);
    if (activeRequests === 0) NProgress.done();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    clearTimeout(startProgressTimeout);
    if (activeRequests === 0) NProgress.done();
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    clearTimeout(startProgressTimeout);
    if (activeRequests === 0) NProgress.done();

    if (error.response?.status === 401) {
      console.warn('Unauthorized access. Redirecting to login.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
