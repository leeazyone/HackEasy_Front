// Front/src/api/client.js
import axios from 'axios';

console.log('🔧 VITE_API_BASE_URL =', import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // https://hackeasy.store
  withCredentials: true,                      // 쿠키 포함
  headers: { 'Content-Type': 'application/json' },
});
