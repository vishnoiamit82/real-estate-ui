// src/api/axiosInstance.js
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Spinner tracking variables
let activeRequests = 0;
let startProgressTimeout = null;
let spinnerStartTime = null;
let setGlobalLoading = null;


// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Define which endpoints require authentication
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
    '/api/saved-properties'
];

// Attach spinner interceptor setup
export const attachSpinnerInterceptor = (setLoadingFn) => {
    setGlobalLoading = setLoadingFn;
};

// Spinner-enhanced request interceptor (add spinner + auth logic)
axiosInstance.interceptors.request.use(
    async (config) => {
        // Spinner logic
        activeRequests++;

        // Delay start to prevent flashing bar on fast requests
        if (activeRequests === 1) {
            startProgressTimeout = setTimeout(() => {
            NProgress.start();
          
            }, 300);
        }
        // if (process.env.NODE_ENV === 'development') {
        //     await new Promise((res) => setTimeout(res, 1500)); // force delay
        // }

        spinnerStartTime = Date.now();

        // Authorization logic
        const token = localStorage.getItem('authToken');
        console.log('Auth Token in Interceptor:', token);
        console.log('Request URL in Interceptor:', config.url);

        const requestUrl = new URL(config.url, process.env.REACT_APP_API_BASE_URL).pathname;
        console.log('Normalized Request URL:', requestUrl);

        const isProtected = protectedEndpoints.some((endpoint) =>
            requestUrl.startsWith(endpoint)
        );

        if (isProtected && token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else if (isProtected && !token) {
            console.warn('Protected route, but no token found!');
        }

        console.log('Request Config Before Sending:', config);

        return config;
    },
    (error) => {
        activeRequests = Math.max(0, activeRequests - 1);
        clearTimeout(startProgressTimeout);
        if (activeRequests === 0) NProgress.done();
        return Promise.reject(error);
      }
);

// Response interceptor (add spinner hide logic + auth error handling)
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
      return Promise.reject(error);
    }
  );

export default axiosInstance;