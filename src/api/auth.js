// Front/src/api/auth.js
import { api } from './client';

export const signup = async (user_id, password, nickname) => {
  try {
    const res = await api.post('/auth/signup', { user_id, password, nickname });
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.msg || '회원가입 요청 실패';
    throw new Error(msg);
  }
};

export const login = async (user_id, password) => {
  try {
    const res = await api.post('/auth/login', { user_id, password });
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.msg || '로그인 요청 실패';
    throw new Error(msg);
  }
};

export const logout = async () => {
  try {
    const res = await api.post('/auth/logout');
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.msg || '로그아웃 요청 실패';
    throw new Error(msg);
  }
};

export const getMe = async () => {
  try {
    const res = await api.get('/auth/me');
    return res.data;                // { user: {...} }
  } catch (err) {
    console.error('getMe 실패:', err?.response || err);
    return null;                    // 실패해도 에러 던지지 않음
  }
};
