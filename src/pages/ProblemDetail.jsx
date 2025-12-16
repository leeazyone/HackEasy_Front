import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChallenges, submitChallengeFlag } from '../api/challenges';
import './ProblemDetail.css';

// description 파싱
const parseSections = (description = '') => {
  const text = String(description || '');

  const storyMatch = text.match(/\[Story\]([\s\S]*?)(\[Objective\]|\[Hint\]|$)/);
  const objMatch = text.match(/\[Objective\]([\s\S]*?)(\[Hint\]|$)/);
  const hintMatch = text.match(/\[Hint\]([\s\S]*?)($)/);

  return {
    story: storyMatch?.[1]?.trim() || '',
    objective: objMatch?.[1]?.trim() || '',
    hint: hintMatch?.[1]?.trim() || '',
  };
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
        const list = await fetchChallenges();
        const found = list.find((c) => String(c.id) === String(id));
        setProblem(found || null);
      } catch {
        setProblem(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitChallengeFlag(id, flag);
      setResult(res?.message || (res?.success ? 'Correct!' : 'Wrong!'));
      if (res?.success) setFlag('');
    } catch (e) {
      setResult(e?.response?.data?.message || '제출 실패');
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!problem) return <p className="loading-text">Problem not found.</p>;

  const { story, objective, hint } = parseSections(problem.description);

  return (
    <div className="problem-detail-page">
      <main className="problem-detail-container">
        <div className="problem-detail-header">
          <h1 className="problem-detail-title">{problem.title}</h1>
          <span className="difficulty-badge badge-easy">
            {problem.difficulty}
          </span>
        </div>

        {/* Story */}
        <div className="problem-section">
          <h2 className="section-title">Story</h2>
          <p className="problem-description-text">{story}</p>
        </div>

        {/* Objective */}
        <div className="problem-section">
          <h2 className="section-title">Objective</h2>
          <p className="problem-description-text">{objective}</p>
        </div>

        {/* Hint */}
        <div className="problem-section">
          <h2 className="section-title">Hint</h2>
          <p className="problem-description-text">{hint}</p>
        </div>

        {/* ✅ 타겟 링크 (이게 지금까지 없던 부분) */}
        {problem.targetUrl && (
          <div className="problem-section">
            <h2 className="section-title">문제 페이지</h2>

            <a
              href={problem.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="problem-button"
            >
              문제 풀러 가기
            </a>
          </div>
        )}

        {/* 플래그 제출 */}
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

          {result && <p className="result-message">{result}</p>}
        </div>
      </main>
    </div>
  );
};

export default ProblemDetail;
