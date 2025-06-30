import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="login-title">📘 Welcome to AutoStudy</h1>
        <p style={{ textAlign: 'center' }}>Plan smarter. Study better. Win exams! 🎯</p>
        <button className="button-purple" onClick={() => navigate('/login')}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
