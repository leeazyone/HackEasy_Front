import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChallenges, submitChallengeFlag } from '../api/challenges';
import './ProblemDetail.css';

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

        // 현재 백엔드는 목록 API만 확실하니까: 목록에서 id로 찾아서 상세처럼 보여주기
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

      // 백엔드 응답 형태에 맞춰 최대한 안전하게 처리
      const message = res?.message ?? (res?.success ? 'Correct!' : 'Wrong!');
      setResult(message);

      if (res?.success) {
        setFlag('');
      }
    } catch (e) {
      // 로그인 필요(authRequired)면 보통 401/403
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

    switch (d) {
      case 'easy':
        return 'badge-easy';
      case 'medium':
        return 'badge-medium';
      case 'hard':
        return 'badge-hard';
      default:
        return '';
    }
  };

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

        <div className="problem-section">
          <h2 className="section-title">Description</h2>
          <p className="problem-description-text">
            {/* mock의 fullDescription 대신, 백엔드 meta.description 사용 */}
            {problem.description || 'No description.'}
          </p>
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
            <div
              className={`result-message ${
                String(result).toLowerCase().includes('correct') ? 'result-success' : 'result-error'
              }`}
            >
              {result}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProblemDetail;
