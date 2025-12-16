import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChallenges } from '../api/challenges';
import './Problems.css';

// [Story]만 뽑기
const extractStory = (description = '') => {
  const text = String(description || '');
  const match = text.match(/\[Story\]([\s\S]*?)(\[Objective\]|\[Hint\]|$)/);
  return match?.[1]?.trim() || '';
};

// 목록에서 너무 길면 줄이기
const clampText = (text = '', max = 220) => {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max).trim() + '…' : t;
};

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

  const diffClass = (difficulty) => {
    const d = String(difficulty || '').toLowerCase();
    if (d === 'easy') return 'difficulty-easy';
    if (d === 'medium') return 'difficulty-medium';
    if (d === 'hard') return 'difficulty-hard';
    return '';
  };

  const handleGo = (id) => {
    navigate(`/problems/${id}`);
  };

  if (loading) {
    return (
      <div className="problems-page">
        <div className="problems-container">
          <h1 className="problems-title">CTF 챌린지</h1>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="problems-page">
        <div className="problems-container">
          <h1 className="problems-title">CTF 챌린지</h1>
          <p className="loading-text">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="problems-page">
      <div className="problems-container">
        <h1 className="problems-title">CTF 챌린지</h1>

        <div className="problems-grid">
          {problems.map((p) => {
            const story = extractStory(p.description);

            return (
              <div key={p.id} className="problem-card">
                {/* ✅ 원래 CSS 클래스명 그대로 */}
                <div className="problem-header">
                  <h2 className="problem-title">{p.title}</h2>
                  {p.difficulty && (
                    <span className={`problem-difficulty ${diffClass(p.difficulty)}`}>
                      {String(p.difficulty).toLowerCase()}
                    </span>
                  )}
                </div>

                {/* ✅ 목록에서는 Story만 */}
                {story && (
                  <p className="problem-description">
                    {clampText(story, 260)}
                  </p>
                )}

                {/* ✅ 버튼도 원래 클래스명 problem-button */}
                <button
                  type="button"
                  className="problem-button"
                  onClick={() => handleGo(p.id)}
                >
                  문제 풀기
                </button>
              </div>
            );
          })}
        </div>

        {problems.length === 0 && (
          <p className="loading-text">등록된 문제가 없어요.</p>
        )}
      </div>
    </div>
  );
};

export default Problems;
