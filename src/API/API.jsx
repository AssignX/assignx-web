import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api.knuassignx.site/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default API;
