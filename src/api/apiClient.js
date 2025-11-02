import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.knuassignx.site/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
