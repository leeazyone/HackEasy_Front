// Front/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { login } from '../api/auth';   // ✅ 여기 추가
import './Login.css';

const Login = () => {
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
      // ✅ axios + baseURL 사용
      const data = await login(userId, password);

      if (data?.user) {
        setMessage(`안녕하세요, ${data.user.nickname || data.user.user_id}님!`);
        navigate('/');
      } else {
        setError(data?.msg || '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError(err.message || '서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-page">
      <Header />
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

            <button type="submit" className="form-button">로그인</button>
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
