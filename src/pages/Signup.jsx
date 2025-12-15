// Front/src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import './Signup.css';

const Signup = () => {
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const data = await signup(userId, password, nickname);

      if (data?.ok) {
        setMessage(data?.msg || '회원가입이 완료되었습니다.');
        setUserId('');
        setNickname('');
        setPassword('');
        setConfirmPassword('');
        navigate('/login');
      } else {
        setError(data?.msg || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || '서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-page">
      <main className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title">회원가입</h1>

          <form onSubmit={handleSubmit} className="signup-form">
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
              <label className="form-label">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="form-input"
                placeholder="닉네임을 입력하세요"
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

            <div className="form-group">
              <label className="form-label">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="비밀번호를 다시 입력"
                required
              />
            </div>

            <button type="submit" className="form-button">
              계정 생성
            </button>
          </form>

          {message && <div className="message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <p className="login-link">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
