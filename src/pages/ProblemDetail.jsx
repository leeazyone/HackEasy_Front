import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChallenges, submitChallengeFlag } from '../api/challenges';
import './ProblemDetail.css';

// ✅ description을 섹션별로 파싱: Story / Objective / Hint
const parseSections = (description = '') => {
  const text = String(description || '');

  const get = (label) => {
    const re = new RegExp(`\\[${label}\\]([\\s\\S]*?)(\\[Story\\]|\\[Objective\\]|\\[Hint\\]|$)`, 'g');
    // 위 regex는 다음 섹션 시작까지 잡는 용도인데, 현재 label 기준으로는
    // 매칭이 꼬일 수 있어, label별로 확실히 분리하는 방식으로 처리
    return null;
  };

  const storyMatch = text.match(/\[Story\]([\s\S]*?)(\[Objective\]|\[Hint\]|$)/);
  const objMatch = text.match(/\[Objective\]([\s\S]*?)(\[Hint\]|$)/);
  const hintMatch = text.match(/\[Hint\]([\s\S]*?)($)/);

  const story = storyMatch?.[1]?.trim() || '';
  const objective = objMatch?.[1]?.trim() || '';
  const hint = hintMatch?.[1]?.trim() || '';

  // 혹시 포맷이 달라서 다 비면, 그냥 전체를 story에 넣어 깨지지 않게
  if (!story && !objective && !hint) {
    return { story: text.trim(), objective: '', hint: '' };
  }

  return { story, objective, hint };
};

const ProblemDetail = () => {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [flag, setFlag] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setResult('');

        const list = await fetchChallenges();
        const found = list.find((c) => String(c.id) === String(id));
        setProblem(found || null);
      } catch (e) {
        setProblem(null);
        setResult(e?.response?.data?.message || '문제 정보를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setResult('');
      const res = await submitChallengeFlag(id, flag);

      const message = res?.message ?? (res?.success ? 'Correct!' : 'Wrong!');
      setResult(message);

      if (res?.success) setFlag('');
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        setResult('로그인이 필요합니다. 로그인 후 다시 제출해 주세요.');
        return;
      }
      setResult(e?.response?.data?.message || '제출 중 오류가 발생했어요.');
    }
  };

  const getDifficultyBadgeClass = (difficulty) => {
    const d = String(difficulty || '').toLowerCase();
    if (d === 'easy') return 'badge-easy';
    if (d === 'medium') return 'badge-medium';
    if (d === 'hard') return 'badge-hard';
    return '';
  };

  const isCorrect =
    String(result).toLowerCase().includes('correct') ||
    String(result).toLowerCase().includes('success');

  if (loading) {
    return (
      <div className="problem-detail-page">
        <div className="problem-detail-container">
          <p className="loading-text">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="problem-detail-page">
        <div className="problem-detail-container">
          <p className="loading-text">Problem not found.</p>
          {result && <p className="loading-text">{result}</p>}
        </div>
      </div>
    );
  }

  const { story, objective, hint } = parseSections(problem.description);

  return (
    <div className="problem-detail-page">
      <main className="problem-detail-container">
        <div className="problem-detail-header">
          <div className="problem-title-row">
            <h1 className="problem-detail-title">{problem.title}</h1>
            {problem.difficulty && (
              <span className={`difficulty-badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* ✅ 상세에서는 전체 섹션 다 노출 */}
        <div className="problem-section">
          <h2 className="section-title">Story</h2>
          <p className="problem-description-text">{story || 'No story.'}</p>
        </div>

        <div className="problem-section">
          <h2 className="section-title">Objective</h2>
          <p className="problem-description-text">{objective || 'No objective.'}</p>
        </div>

        <div className="problem-section">
          <h2 className="section-title">Hint</h2>
          <p className="problem-description-text">{hint || 'No hint.'}</p>
        </div>

        <div className="problem-section">
          <h2 className="section-title">플래그 제출</h2>

          <form onSubmit={handleSubmit} className="flag-form">
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="HE{enter_your_flag_here}"
              className="flag-input"
            />

            <button type="submit" className="submit-button">
              제출
            </button>
          </form>

          {result && (
            <div className={`result-message ${isCorrect ? 'result-success' : 'result-error'}`}>
              {result}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProblemDetail;
