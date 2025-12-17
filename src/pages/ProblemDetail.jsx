import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { fetchChallenges, submitChallengeFlag } from '../api/challenges';
import './ProblemDetail.css';

// description 파싱(예전 포맷 호환용)
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

  // ✅ Story만 먼저 보여주고, 나머지는 버튼으로 펼치기
  const [showObjective, setShowObjective] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // ✅ 힌트는 일정 시간 지나야 열 수 있게(난이도/몰입 유지용)
  const HINT_DELAY_MS = 60 * 1000; // 60초 (원하면 30초, 120초 등으로 바꾸면 됨)
  const [hintUnlocked, setHintUnlocked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setResult('');

        const list = await fetchChallenges();
        const found = list.find((c) => String(c.id) === String(id));
        setProblem(found || null);

        // 문제 이동할 때 펼침 상태 초기화
        setShowObjective(false);
        setShowHint(false);
        setHintUnlocked(false);
      } catch (e) {
        setProblem(null);
        setResult(e?.response?.data?.message || '문제 정보를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ✅ 힌트 지연 해제 타이머
  useEffect(() => {
    if (!problem) return;

    // 힌트 자체가 없으면 굳이 unlock할 필요 없음
    const parsed = parseSections(problem.description);
    const hint = (problem.hint ?? parsed.hint ?? '').trim();
    if (!hint) return;

    const t = setTimeout(() => setHintUnlocked(true), HINT_DELAY_MS);
    return () => clearTimeout(t);
  }, [problem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setResult('');
      const res = await submitChallengeFlag(id, flag);

      const message =
        res?.message ??
        (res?.ok ? 'Correct!' : 'Wrong!');

      setResult(message);

      if (res?.ok) setFlag('');
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

  // ✅ 백엔드 새 포맷(story/objective/hint) 우선 사용
  // ✅ 없으면 예전 포맷(description) 파싱해서 호환
  const parsed = parseSections(problem.description);
  const story = (problem.story ?? parsed.story ?? '').trim();
  const objective = (problem.objective ?? parsed.objective ?? '').trim();
  const hint = (problem.hint ?? parsed.hint ?? '').trim();

  // ✅ targetUrl이 백엔드에 없으면 프론트에서 fallback으로 생성
  const targetUrl =
    problem.targetUrl ||
    (problem.id ? `https://targets.hackeasy.store/${problem.id}` : '');

  // ✅ 버튼 문구
  const objectiveBtnText = showObjective ? 'Objective 숨기기' : 'Objective 보기';
  const hintBtnText = showHint ? 'Hint 숨기기' : 'Hint 보기';

  // ✅ 힌트 잠금 상태 안내 문구 (남은 시간 표시까지 하고 싶으면 추가 가능)
  const hintLockedText = useMemo(() => {
    if (!hint) return '';
    if (hintUnlocked) return '';
    return '힌트는 잠시 후 열 수 있어요.';
  }, [hint, hintUnlocked]);

  return (
    <div className="problem-detail-page">
      <main className="problem-detail-container">
        <div className="problem-detail-header">
          <div className="problem-title-row">
            <h1 className="problem-detail-title">{problem.title}</h1>
            {problem.difficulty && (
              <span
                className={`difficulty-badge ${getDifficultyBadgeClass(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* ✅ Story만 기본 노출 */}
        <div className="problem-section">
          <h2 className="section-title">Story</h2>
          <p className="problem-description-text">
            {story || 'No story.'}
          </p>
        </div>

        {/* ✅ Objective/Hint는 “나중에” 펼치기 */}
        <div className="problem-section">
          <h2 className="section-title">지원 정보</h2>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Objective 토글 */}
            {objective ? (
              <button
                type="button"
                className="problem-button"
                onClick={() => setShowObjective((v) => !v)}
              >
                {objectiveBtnText}
              </button>
            ) : (
              <button type="button" className="problem-button" disabled>
                Objective 없음
              </button>
            )}

            {/* Hint 토글(지연 해제 후 활성화) */}
            {hint ? (
              <button
                type="button"
                className="problem-button"
                onClick={() => setShowHint((v) => !v)}
                disabled={!hintUnlocked}
                title={!hintUnlocked ? '잠시 후 열 수 있어요.' : ''}
              >
                {hintBtnText}
              </button>
            ) : (
              <button type="button" className="problem-button" disabled>
                Hint 없음
              </button>
            )}
          </div>

          {/* 잠금 안내 */}
          {hintLockedText && (
            <p className="problem-description-text" style={{ marginTop: '10px', opacity: 0.75 }}>
              {hintLockedText}
            </p>
          )}

          {/* 펼침 영역 */}
          {showObjective && objective && (
            <div style={{ marginTop: '14px' }}>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>Objective</h3>
              <p className="problem-description-text">{objective}</p>
            </div>
          )}

          {showHint && hintUnlocked && hint && (
            <div style={{ marginTop: '14px' }}>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>Hint</h3>
              <p className="problem-description-text">{hint}</p>
            </div>
          )}
        </div>

        {/* ✅ 외부 문제 사이트 링크 */}
        {targetUrl && (
          <div className="problem-section">
            <h2 className="section-title">문제 페이지</h2>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="problem-button"
            >
              문제 풀러 가기
            </a>
          </div>
        )}

        {/* Flag submit */}
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
                isCorrect ? 'result-success' : 'result-error'
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
