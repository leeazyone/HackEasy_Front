// src/api/challenges.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ https://api.hackeasy.store
  withCredentials: true,                      // ✅ 세션/쿠키 필요하면 유지
});

export const fetchChallenges = async () => {
  const res = await api.get('/api/challenges');
  return res.data?.challenges || [];
};

export const submitChallengeFlag = async (id, flag) => {
  const res = await api.post(`/api/challenges/${id}/submit`, { flag });
  return res.data;
};
