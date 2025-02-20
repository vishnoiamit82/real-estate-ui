// src/api/axiosInstance.js
import axios from 'axios';

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

// Add a request interceptor to include the Authorization header only for protected routes
// Add a request interceptor to include the Authorization header only for protected routes
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        console.log('Auth Token in Interceptor:', token);
        console.log('Request URL in Interceptor:', config.url);

        // Ensure the request URL is absolute to match protected endpoints
        const requestUrl = new URL(config.url, process.env.REACT_APP_API_BASE_URL).pathname;
        console.log('Normalized Request URL:', requestUrl);

        // Check if the request URL is in the protected endpoints list
        const isProtected = protectedEndpoints.some((endpoint) =>
            requestUrl.startsWith(endpoint)
        );

        if (isProtected && token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Authorization header set:', config.headers['Authorization']);
        } else if (isProtected && !token) {
            console.warn('Protected route, but no token found!');
        }

        console.log('Request Config Before Sending:', config);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);


// Improved response interceptor for handling global errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
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
