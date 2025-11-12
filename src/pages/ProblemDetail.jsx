import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { fetchProblemById, submitFlag } from '../api/mock';
import './ProblemDetail.css';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [flag, setFlag] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblemById(id).then(data => {
      setProblem(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFlag(id, flag).then(response => {
      setResult(response.message);
      if (response.success) {
        setFlag('');
      }
    });
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard': return 'badge-hard';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="problem-detail-page">
        <Header />
        <div className="problem-detail-container">
          <p className="loading-text">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="problem-detail-page">
        <Header />
        <div className="problem-detail-container">
          <p className="loading-text">Problem not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-detail-page">
      <Header />
      
      <main className="problem-detail-container">
        <div className="problem-detail-header">
          <div className="problem-title-row">
            <h1 className="problem-detail-title">
              {problem.title}
            </h1>
            <span className={`difficulty-badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>

        <div className="problem-section">
          <h2 className="section-title">Description</h2>
          <p className="problem-description-text">
            {problem.fullDescription}
          </p>
        </div>

        <div className="problem-section">
          <h2 className="section-title">플래그 제출</h2>
          
          <form onSubmit={handleSubmit} className="flag-form">
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="flag{enter_your_flag_here}"
              className="flag-input"
            />
            
            <button
              type="submit"
              className="submit-button"
            >
              제출
            </button>
          </form>

          {result && (
            <div className={`result-message ${
              result.includes('Correct') 
                ? 'result-success' 
                : 'result-error'
            }`}>
              {result}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProblemDetail;
