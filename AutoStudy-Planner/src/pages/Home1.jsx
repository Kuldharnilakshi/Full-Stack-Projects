import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ Import images
import logoImg from '../assets/logo.png';
import trackIcon from '../assets/track.png';
import uploadIcon from '../assets/upload.png';
import crashIcon from '../assets/crash.png';
import profileIcon from '../assets/profile.png';
import smarticon from '../assets/smart.png';

const quotes = [
  "Plan Smart. Study Hard. Succeed Big.",
  "Your syllabus isn’t a burden, it’s your blueprint to success.",
  "Every topic you finish is a step closer to your goal.",
  "Great achievements begin with daily efforts.",
  "You’re not behind. You’re just getting started.",
  "Stay consistent. Stay unstoppable."
];

function Home1() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Student';

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home1-wrapper">
      <nav className="navbar">
        <div className="logo">
          <img src={logoImg} alt="Logo" className="logo-img" />
          <span className="logo-text">AutoStudy Planner</span>
        </div>

        {/* Right Section: Dark Mode + Profile */}
        <div className="nav-right">
           
          <button className="dark-toggle" onClick={() => setDarkMode(prev => !prev)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
           <button className="profile-button" onClick={() => navigate('/profile')}>
            <img src={profileIcon} alt="Profile" className="profile-icon-img" />
          </button>
                </div>
      </nav>

      <div className="home1-content">
        <h1>Welcome back, {userName}! 🎉</h1>
        <p>You're doing great. Keep studying and achieve your goals! 🚀</p>

        <div className="card-grid">
          <div className="card-button" onClick={() => navigate('/upload')}>
            <img src={uploadIcon} alt="Upload" className="card-icon" />
            <span>Create Study Plan</span>
          </div>

          <div className="card-button" onClick={() => navigate('/smart-planner')}>
            <img src={smarticon} alt="smart-planner" className="card-icon" />
            <span> Create Smart Plan</span>
          </div>

          <div className="card-button" onClick={() => navigate('/track')}>
            <img src={trackIcon} alt="Track" className="card-icon" />
            <span>Track My Progress</span>
          </div>

          <div className="card-button" onClick={() => navigate('/crashplan')}>
            <img src={crashIcon} alt="Create Crash Plan" className="card-icon" />
            <span>Crash Plan</span>
          </div>

          
        </div>

        {/* ✨ Animated Quotes */}
        <div className="motivational-quote-wrapper">
          <AnimatePresence mode="wait">
            <motion.h1
              key={quotes[currentQuoteIndex]}
              className="home-quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {quotes[currentQuoteIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Home1;
