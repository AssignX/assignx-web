import API from './API';

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Request-ID'] =
      crypto.randomUUID?.() || Date.now().toString(36);
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    console.warn('API error:', {
      url: config?.url,
      method: config?.method,
      status: response?.status,
    });

    if (response?.status === 401 && !config.__isRetry) {
      config.__isRetry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          return API(config);
        }
      } catch (e) {
        console.error('Token refresh failed:', e);
      }
    }
    return Promise.reject(error);
  }
);
