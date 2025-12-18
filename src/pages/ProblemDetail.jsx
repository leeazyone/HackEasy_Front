import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChallenges, submitChallengeFlag } from '../api/challenges';
import './ProblemDetail.css';

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

const ProblemDetail = ({ onSolved }) => {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [flag, setFlag] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  const [showObjective, setShowObjective] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [explainTab, setExplainTab] = useState('concept'); // concept | solution
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setResult('');

        const list = await fetchChallenges();
        const found = list.find((c) => String(c.id) === String(id));

        if (!alive) return;

        setProblem(found || null);
        setShowObjective(false);
        setShowHint(false);
        setIsSolved(false);
        setExplainTab('concept');
      } catch (e) {
        if (!alive) return;
        setProblem(null);
        setResult('문제 정보를 불러오지 못했어요.');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setResult('');
      const res = await submitChallengeFlag(id, flag);

      const message = res?.message ?? (res?.ok ? 'Correct!' : 'Wrong!');
      setResult(message);

      if (res?.ok) {
        setIsSolved(true);

        // ✅ 정답 처리되면 마이페이지 stats 갱신
        if (typeof onSolved === 'function') {
          await onSolved();
        }

        // (선택) 문제 다시 로드 (현재도 explanation 포함으로 내려오면 반영됨)
        const list = await fetchChallenges();
        const updated = list.find((c) => String(c.id) === String(id));
        setProblem(updated || problem);

        setFlag('');
      }
    } catch (e) {
      setResult('제출 중 오류가 발생했어요.');
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

  const parsed = parseSections(problem?.description);
  const story = (problem?.story ?? parsed.story ?? '').trim();
  const objective = (problem?.objective ?? parsed.objective ?? '').trim();
  const hint = (problem?.hint ?? parsed.hint ?? '').trim();

  const explanation = problem?.explanation;
  const hasExplanation =
    isSolved && explanation && (explanation.concept || explanation.solution);

  const targetUrl =
    problem?.targetUrl ||
    (problem?.id ? `https://targets.hackeasy.store/${problem.id}` : '');

  if (loading) return <p className="loading-text">Loading problem...</p>;
  if (!problem) return <p className="loading-text">Problem not found.</p>;

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
          <p className="problem-description-text">{story || 'No story.'}</p>
        </div>

        <div className="problem-section">
          <h2 className="section-title">추가 정보</h2>

          <div className="toggle-row">
            <button
              type="button"
              className="problem-button"
              onClick={() => setShowObjective((v) => !v)}
              disabled={!objective}
            >
              {showObjective ? 'Objective 숨기기' : 'Objective 보기'}
            </button>

            <button
              type="button"
              className="problem-button"
              onClick={() => setShowHint((v) => !v)}
              disabled={!hint}
            >
              {showHint ? 'Hint 숨기기' : 'Hint 보기'}
            </button>
          </div>

          {showObjective && (
            <div className="sub-section">
              <h3 className="section-title small">Objective</h3>
              <p className="problem-description-text">{objective}</p>
            </div>
          )}

          {showHint && (
            <div className="sub-section">
              <h3 className="section-title small">Hint</h3>
              <p className="problem-description-text">{hint}</p>
            </div>
          )}
        </div>

        {targetUrl && (
          <div className="problem-section">
            <h2 className="section-title">문제 페이지</h2>
            <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="problem-button">
              문제 풀러 가기
            </a>
          </div>
        )}

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

        {/* ✅ 해설 영역 (정답 맞힌 사람만) */}
        {hasExplanation && (
          <div className="problem-section explanation-section">
            <h2 className="section-title">해설</h2>

            <div className="explain-tabs">
              <button
                type="button"
                className={`explain-tab ${explainTab === 'concept' ? 'active' : ''}`}
                onClick={() => setExplainTab('concept')}
              >
                개념 해설
              </button>
              <button
                type="button"
                className={`explain-tab ${explainTab === 'solution' ? 'active' : ''}`}
                onClick={() => setExplainTab('solution')}
              >
                풀이 해설
              </button>
            </div>

            <div className="explain-body">
              {explainTab === 'concept' && (
                <pre className="problem-description-text">{explanation.concept}</pre>
              )}
              {explainTab === 'solution' && (
                <pre className="problem-description-text">{explanation.solution}</pre>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProblemDetail;
