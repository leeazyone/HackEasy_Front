import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchChallenges } from '../api/challenges';
import './Problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges()
      .then((data) => {
        setProblems(data);
      })
      .catch((err) => {
        console.error(err);
        setProblems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getDifficultyClass = (difficulty) => {
    switch ((difficulty || '').toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return '';
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
                to={`/problems/${problem.id}`}   // ✅ c1 같은 문자열 id로 이동
                className="problem-button"
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
