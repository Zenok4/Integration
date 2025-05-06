import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // địa chỉ Flask backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Gắn token nếu có
API.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
