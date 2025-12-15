import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    if (onLogout) {
      await onLogout();
    }
    navigate('/'); // 로그아웃 후 홈으로
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <svg
            className="header-logo-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <Link to="/" className="header-logo-text">
            HackEasy
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/problems">Problems</Link>
          {user && <Link to="/mypage">My Page</Link>}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <span className="header-user">
                {user.nickname || user.user_id}님
              </span>
              <button
                type="button"
                className="header-login" // 클래스는 일단 기존 거 재활용
                onClick={handleLogoutClick}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-login">
                로그인
              </Link>
              <Link to="/signup" className="header-signup">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
