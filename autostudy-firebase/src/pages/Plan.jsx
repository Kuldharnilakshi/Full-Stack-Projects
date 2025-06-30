import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles.css';

function Plan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, examDate, hoursPerDay, totalTopics } = location.state || {};

  if (!plan || plan.length === 0) {
    return (
      <div className="page-container gradient-bg">
        <motion.div
          className="card frosted-glass"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p style={{ textAlign: 'center', color: 'red' }}>
            ❌ No plan found. Please upload your syllabus first.
          </p>
          <button className="button-purple" onClick={() => navigate('/upload')}>
            📤 Go to Upload Page
          </button>
        </motion.div>
      </div>
    );
  }

  const handleStartTracking = () => {
    localStorage.setItem('userPlan', JSON.stringify(plan));
    localStorage.setItem('examDate', examDate);
    localStorage.setItem('completedTopics', JSON.stringify([]));
    navigate('/track');
  };

  return (
    <div className="page-container gradient-bg">
      <motion.div
        className="card frosted-glass"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="plan-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          🧠 Smart Study Planner
        </motion.h2>

        <motion.div
          className="summary-box vibrant-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p><strong>📅 Exam Date:</strong> {examDate}</p>
          <p><strong>⏰ Daily Study Hours:</strong> {hoursPerDay}</p>
          <p><strong>📘 Total Topics:</strong> {totalTopics}</p>
        </motion.div>

        <div className="timeline-container">
          {plan.map((entry, idx) => (
            <motion.div
              key={idx}
              className="timeline-card neon-box"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <h4 className="timeline-day">📅 Day {entry.day}</h4>
              <ul className="timeline-list">
                {entry.topics.map((topic, i) => (
                  <li key={i}>📘 {topic}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div className="button-group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <button className="button-outline" onClick={() => navigate('/upload')}>
            🔙 Back
          </button>
          <button className="button-purple" onClick={handleStartTracking}>
            ✅ Start Tracking
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Plan;