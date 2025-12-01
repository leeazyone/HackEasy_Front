import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 백엔드 서버 주소
  withCredentials: true,                       
  headers: { 'Content-Type': 'application/json' },
});      

export async function login(user_id, password) {
  const res = await api.post('/auth/login', { user_id, password });
  // 성공 시: { user: { id, user_id, nickname } }
  return res.data;
}
