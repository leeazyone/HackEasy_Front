// Front/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getMe } from '../api/auth';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // 1) 로그인 요청 → 세션 쿠키 저장
      const data = await login(userId, password);

      if (data?.user) {
        // 2) 혹시 백엔드에서 /auth/login에 user 안 주면, /auth/me 다시 호출
        let user = data.user;
        if (!user) {
          const me = await getMe();
          user = me.user;
        }

        // 3) App.jsx 쪽 user 상태 업데이트
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }

        setMessage(`안녕하세요, ${user.nickname || user.user_id}님!`);
        navigate('/mypage'); // 로그인 후 마이페이지로
      } else {
        setError(data?.msg || '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || '서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-page">
      <main className="login-container">
        <div className="login-card">
          <h1 className="login-title">로그인</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">아이디</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="form-input"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="비밀번호"
                required
              />
            </div>

            <button type="submit" className="form-button">
              로그인
            </button>
          </form>

          {message && <div className="message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <p className="signup-link">
            아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
