// src/api/challenges.js
import { api } from './client';

export const fetchChallenges = async () => {
  const res = await api.get('/api/challenges');
  return res.data?.challenges || [];
};

export const fetchChallengeDetail = async (id) => {
  const res = await api.get(`/api/challenges/${id}`);
  return res.data?.challenge || null;
};

export const submitChallengeFlag = async (id, flag) => {
  const res = await api.post(`/api/challenges/${id}/submit`, { flag });
  return res.data;
};
