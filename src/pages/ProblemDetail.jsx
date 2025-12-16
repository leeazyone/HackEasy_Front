import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChallenges, submitChallengeFlag } from '../api/challenges';
import './ProblemDetail.css';

// ✅ [Story] ~ [Objective]/[Hint] 전까지만 뽑아오는 함수
const extractStory = (description = '') => {
  const text = String(description || '');

  // [Story] 내용만: [Objective]나 [Hint]가 나오기 전까지
  const match = text.match(/\[Story\]([\s\S]*?)(\[Objective\]|\[Hint\]|$)/);
  if (match && match[1]) return match[1].trim();

  // 혹시 형식이 다르면 그냥 전체 출력(안 깨지게)
  return text.trim();
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

        // ✅ 상세 API 없으니 목록에서 찾아서 상세처럼 표시
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

  const isCorrect = String(result).toLowerCase().includes('correct') || String(result).toLowerCase().includes('success');

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
          <h2 className="section-title">Story</h2>

          {/* ✅ 여기서 Story만 출력 */}
          <p className="problem-description-text">
            {extractStory(problem.description)}
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
