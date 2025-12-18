// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import MyPage from './pages/MyPage';

import { getMe, logout } from './api/auth';

function PrivateRoute({ user, loading, children }) {
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ solvedCount: 0, totalScore: 0 });
  const [loadingUser, setLoadingUser] = useState(true);

  const refreshMe = async () => {
    const data = await getMe(); // { user, stats } 또는 null
    if (data?.user) {
      setUser(data.user);
      setStats(data.stats || { solvedCount: 0, totalScore: 0 });
    } else {
      setUser(null);
      setStats({ solvedCount: 0, totalScore: 0 });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } finally {
        setLoadingUser(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setStats({ solvedCount: 0, totalScore: 0 });
    }
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />

        {/* ✅ 정답 제출 성공하면 refreshMe()로 stats 갱신 */}
        <Route path="/problems/:id" element={<ProblemDetail onSolved={refreshMe} />} />

        <Route
          path="/login"
          element={<Login onLoginSuccess={refreshMe} />}
        />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/mypage"
          element={
            <PrivateRoute user={user} loading={loadingUser}>
              <MyPage user={user} stats={stats} />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
