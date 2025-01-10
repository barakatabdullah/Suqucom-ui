import axios, { type AxiosRequestHeaders } from 'axios';

const api = axios.create({
  // Request timeout
  timeout: 60000,
});

const adminApi = axios.create({
  // Request timeout
  timeout: 60000,
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();
  // Set the base URL
  config.baseURL = '/api';

  // Set the request headers
  config.headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + userStore.getUserToken(),
    ...config.headers, // Allow overriding existing headers
  } as AxiosRequestHeaders;

  config.headers['Accept-Language'] = settingsStore.settings.lang;


  return config;
});

adminApi.interceptors.request.use((config) => {
  const adminStore = useAdminStore();
  const settingsStore = useSettingsStore();
  // Set the base URL
  config.baseURL = '/api/admin';

  // Set the request headers
  config.headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + adminStore.getAdminToken(),
    ...config.headers, // Allow overriding existing headers
  } as AxiosRequestHeaders;

  config.headers['Accept-Language'] = settingsStore.settings.lang;


  return config;
});

export { api, adminApi };