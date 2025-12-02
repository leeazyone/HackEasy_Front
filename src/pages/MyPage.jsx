// src/pages/MyPage.jsx
import { useEffect, useState } from 'react';
import { getMe } from '../api/auth';
import './MyPage.css'; // 없으면 나중에 만들면 됨

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
        setStats(data.stats || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMe();
  }, []);

  if (!user) return null; // 로딩 화면 만들고 싶으면 여기서 처리

  return (
    <div className="mypage">
      <h1 className="mypage-title">마이페이지</h1>

      <section className="mypage-section">
        <h2>프로필</h2>
        <p>아이디: {user.user_id}</p>
        <p>닉네임: {user.nickname}</p>
      </section>

      {stats && (
        <section className="mypage-section">
          <h2>풀이 현황</h2>
          <p>푼 문제 수: {stats.solvedCount}개</p>
          <p>총 점수: {stats.totalScore}점</p>
        </section>
      )}
    </div>
  );
};

export default MyPage;
