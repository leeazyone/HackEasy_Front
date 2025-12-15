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
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMe();   // { user } 또는 null
        if (data?.user) setUser(data.user);
        else setUser(null);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchMe();
  }, []);

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
    <>
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
              <MyPage user={user} />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
