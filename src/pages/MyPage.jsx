// src/pages/MyPage.jsx
//import './MyPage.css';

const MyPage = ({ user }) => {
  // 안전장치
  if (!user) {
    return (
      <div className="mypage">
        <div className="mypage-container">
          <p className="no-user">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage">
      <div className="mypage-container">
        <h1 className="mypage-title">마이페이지</h1>
        
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-icon">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 className="profile-name">{user.nickname}</h2>
          </div>
          
          <div className="profile-info">
            <div className="info-card">
              <label className="info-label">아이디</label>
              <p className="info-value">{user.user_id}</p>
            </div>
            
            <div className="info-card">
              <label className="info-label">닉네임</label>
              <p className="info-value">{user.nickname}</p>
            </div>
          </div>
        </div>

        {/* 추후 확장 섹션 */}
        <div className="stats-section">
          <h3 className="section-title">활동 통계</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <p className="stat-value">0</p>
              <p className="stat-label">해결한 문제</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <p className="stat-value">0</p>
              <p className="stat-label">획득 점수</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <p className="stat-value">0</p>
              <p className="stat-label">보유 뱃지</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
