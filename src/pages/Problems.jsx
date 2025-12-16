import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChallenges } from '../api/challenges';
import './Problems.css';

const Problems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const list = await fetchChallenges();
        setProblems(list || []);
      } catch (e) {
        setErrorMsg(e?.response?.data?.message || '문제 목록을 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getDifficultyBadgeClass = (difficulty) => {
    const d = String(difficulty || '').toLowerCase();
    if (d === 'easy') return 'badge-easy';
    if (d === 'medium') return 'badge-medium';
    if (d === 'hard') return 'badge-hard';
    return '';
  };

  const handleGo = (id) => {
    navigate(`/problems/${id}`);
  };

  if (loading) {
    return (
      <div className="problems-page">
        <div className="problems-container">
          <h1 className="page-title">CTF 챌린지</h1>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="problems-page">
        <div className="problems-container">
          <h1 className="page-title">CTF 챌린지</h1>
          <p className="loading-text">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="problems-page">
      <div className="problems-container">
        <h1 className="page-title">CTF 챌린지</h1>

        <div className="problems-grid">
          {problems.map((p) => (
            <div key={p.id} className="problem-card">
              <div className="problem-card-header">
                <h2 className="problem-title">{p.title}</h2>
                {p.difficulty && (
                  <span className={`difficulty-badge ${getDifficultyBadgeClass(p.difficulty)}`}>
                    {p.difficulty}
                  </span>
                )}
              </div>

              {/* ✅ 여기서 description/story는 아예 안 보여줌 */}

              <div className="problem-card-actions">
                <button className="start-button" onClick={() => handleGo(p.id)}>
                  문제 풀기
                </button>
              </div>
            </div>
          ))}
        </div>

        {problems.length === 0 && (
          <p className="loading-text">등록된 문제가 없어요.</p>
        )}
      </div>
    </div>
  );
};

export default Problems;
