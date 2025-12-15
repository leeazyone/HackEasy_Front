import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // 백엔드에서 문제 목록 가져오기
        const res = await fetch('/api/challenges', {
          method: 'GET',
          credentials: 'include', // ✅ 세션 쿠키 포함
        });

        if (!res.ok) {
          throw new Error('Failed to fetch challenges');
        }

        const data = await res.json();

        // 백엔드 meta 형식에 맞춰 프론트에서 쓰는 형태로 변환
        const mapped = (data.challenges || []).map((ch) => ({
          id: ch.id, // ✅ c1 같은 문자열
          title: ch.title,
          difficulty: (ch.difficulty || '').toUpperCase() === 'EASY' ? 'Easy'
                    : (ch.difficulty || '').toUpperCase() === 'MEDIUM' ? 'Medium'
                    : (ch.difficulty || '').toUpperCase() === 'HARD' ? 'Hard'
                    : ch.difficulty || 'Easy',
          description: ch.description || '',
          accessible: ch.accessible ?? true, // 백엔드에서 주면 사용
        }));

        setProblems(mapped);
      } catch (err) {
        console.error(err);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return '';
    }
  };

  // ✅ 로그인/접근 불가 시 버튼 클릭 차단
  const handleEnter = (problem, e) => {
    if (problem.accessible === false) {
      e.preventDefault();
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="problems-page">
        <div className="problems-container">
          <p className="loading-text">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="problems-page">
      <main className="problems-container">
        <h1 className="problems-title">CTF 챌린지</h1>

        <div className="problems-grid">
          {problems.map((problem) => (
            <div key={problem.id} className="problem-card">
              <div className="problem-header">
                <h3 className="problem-title">{problem.title}</h3>
                <span className={`problem-difficulty ${getDifficultyClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>

              <p className="problem-description">{problem.description}</p>

              <Link
                to={`/problems/${problem.id}`}
                className={`problem-button ${problem.accessible === false ? 'disabled' : ''}`}
                onClick={(e) => handleEnter(problem, e)}
              >
                문제 풀기
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Problems;
