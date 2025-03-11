// src/api/axiosInstance.js
import axios from 'axios';

// Spinner tracking variables
let activeRequests = 0;
let spinnerStartTime = null;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
    '/api/send-email'
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
        if (setGlobalLoading) setGlobalLoading(true);
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
        if (activeRequests === 0 && setGlobalLoading) setGlobalLoading(false);
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor (add spinner hide logic + auth error handling)
axiosInstance.interceptors.response.use(
    async (response) => {
        activeRequests = Math.max(0, activeRequests - 1);
        const elapsed = Date.now() - spinnerStartTime;
        const minDuration = 600;
        if (elapsed < minDuration) await sleep(minDuration - elapsed);
        if (activeRequests === 0 && setGlobalLoading) setGlobalLoading(false);
        return response;
    },
    async (error) => {
        activeRequests = Math.max(0, activeRequests - 1);
        const elapsed = Date.now() - spinnerStartTime;
        const minDuration = 600;
        if (elapsed < minDuration) await sleep(minDuration - elapsed);
        if (activeRequests === 0 && setGlobalLoading) setGlobalLoading(false);

        console.error('API Response Error:', error.response);

        if (error.response?.status === 401) {
            console.warn('Unauthorized! Token might be invalid or expired.');
            localStorage.removeItem('authToken');
            alert('Session expired. Please log in again.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;