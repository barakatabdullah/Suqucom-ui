import axios, { type AxiosRequestHeaders } from 'axios';

const api = axios.create({
  // Request timeout
  timeout: 60000,
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const userStore = useUserStore();
  // Set the base URL
  config.baseURL = '/api';

  // Set the request headers
  config.headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + userStore.getUserToken(),
    ...config.headers, // Allow overriding existing headers
  } as AxiosRequestHeaders;

  config.headers['Accept-Language'] = 'en';


  return config;
});

export default api;