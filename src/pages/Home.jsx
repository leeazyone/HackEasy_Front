import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    {
      title: '초보자 전용 문제',
      description: '모두 쉬운 난이도로 구성되어 있어요. 해킹이 처음인 사람도 부담 없이 시작할 수 있습니다.'
    },
    {
      title: '브라우저에서 바로 실습',
      description: '복잡한 설정 없이 웹 브라우저에서 문제를 풀며 개념을 익힐 수 있습니다.'
    },
    {
      title: '자세한 풀이 제공',
      description: '정답과 함께 해설을 제공하여 원리를 배울 수 있습니다.'
    }
  ];

  return (
    <div className="home">
      
      <main>
        <section className="hero">
          <div className="hero-icon-container">
            <svg className="hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          
          <h1 className="hero-title">
            처음부터 천천히, HackEasy처럼 쉽게
          </h1>
          
          <p className="hero-description">
            해킹의 첫걸음은 웹에서 시작된다. HackEasy는 초보자도 쉽게 즐길 수 있는 웹해킹 학습 공간입니다.
          </p>
          
        </section>

        <section className="features">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          © 2025 HackEasy
        </div>
      </footer>
    </div>
  );
};

export default Home;
