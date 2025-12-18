// src/api/client.js
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ https://api.hackeasy.store
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});