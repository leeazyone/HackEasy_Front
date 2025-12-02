// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import MyPage from './pages/MyPage'; // 👈 새로 만들 페이지

import { getMe, logout } from './api/auth';

// 로그인 필요한 라우트
function PrivateRoute({ user, loading, children }) {
  if (loading) return null; // 로딩 중엔 아무것도 안 보여주거나 스피너 넣어도 됨
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);         // 로그인 유저 정보
  const [loadingUser, setLoadingUser] = useState(true); // /auth/me 로딩 여부

  // 새로고침했을 때 /auth/me 로 로그인 상태 복원
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMe(); // { user, stats? }
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchMe();
  }, []);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  return (
    <BrowserRouter>
      {/* ✅ 헤더는 여기서 한 번만 렌더링 */}
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />

        <Route
          path="/login"
          element={<Login onLoginSuccess={setUser} />}
        />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/mypage"
          element={
            <PrivateRoute user={user} loading={loadingUser}>
              <MyPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
