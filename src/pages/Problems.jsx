import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { fetchProblems } from '../api/mock';
import './Problems.css';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems().then(data => {
      setProblems(data);
      setLoading(false);
    });
  }, []);

  const getDifficultyClass = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="problems-page">
        <Header />
        <div className="problems-container">
          <p className="loading-text">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="problems-page">
      <Header />
      
      <main className="problems-container">
        <h1 className="problems-title">CTF 챌린지</h1>
        
        <div className="problems-grid">
          {problems.map(problem => (
            <div key={problem.id} className="problem-card">
              <div className="problem-header">
                <h3 className="problem-title">
                  {problem.title}
                </h3>
                <span className={`problem-difficulty ${getDifficultyClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>
              
              <p className="problem-description">
                {problem.description}
              </p>
              
              <Link
                to={`/problems/${problem.id}`}
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
