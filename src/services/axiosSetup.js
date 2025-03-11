// services/axiosSetup.js
import axios from 'axios';
import { toast } from 'react-toastify';

let activeRequests = 0;

const showSpinner = () => {
  document.body.classList.add('loading');
};

const hideSpinner = () => {
  if (activeRequests === 0) {
    document.body.classList.remove('loading');
  }
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      console.log('🔄 Axios request started');
      activeRequests += 1;
      showSpinner();
      return config;
    },
    (error) => {
      console.log('⚠️ Axios request error');   
      activeRequests -= 1;
      hideSpinner();
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      activeRequests -= 1;
      hideSpinner();
      return response;
    },
    (error) => {
      activeRequests -= 1;
      hideSpinner();
      toast.error('Something went wrong!');
      return Promise.reject(error);
    }
  );
};
