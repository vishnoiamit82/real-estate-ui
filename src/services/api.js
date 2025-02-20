import axiosInstance from '../axiosInstance';

// Use the environmentalized base URL
const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const createProperty = (propertyData) => API.post('/properties', propertyData);
export const getAllProperties = () => API.get('/properties');
