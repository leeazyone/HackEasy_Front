import axios from 'axios';

const api = axios.create({
  withCredentials: true,               // 세션 쿠키 필요
  headers: { 'Content-Type': 'application/json' },
});

export async function login(user_id, password) {
  const res = await api.post('/auth/login', { user_id, password });
  // 성공 시: { user: { id, user_id, nickname } }
  return res.data;
}
