// Front/src/pages/MyPage.jsx
import './MyPage.css';

const MyPage = ({ user }) => {
  // 혹시 모를 안전장치
  if (!user) return null;

  return (
    <div className="mypage">
      <h1 className="mypage-title">마이페이지</h1>

      <section className="mypage-section">
        <h2>프로필</h2>
        <p>아이디: {user.user_id}</p>
        <p>닉네임: {user.nickname}</p>
      </section>

      {/* 나중에 푼 문제/점수, 뱃지 이런 거 여기 섹션만 추가하면 됨 */}
    </div>
  );
};

export default MyPage;
