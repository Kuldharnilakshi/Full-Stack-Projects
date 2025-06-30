import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles.css';

function CrashPlan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { remainingTopics, crashDays = 3 } = location.state || {};

  if (!remainingTopics || remainingTopics.length === 0) {
    return (
      <div className="page-container gradient-bg">
        <motion.div
          className="card frosted-glass"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="login-title">🎉 You're All Caught Up!</h2>
          <p>No crash revision plan is needed.</p>
          <button className="button-purple" onClick={() => navigate('/track')}>Go Back</button>
        </motion.div>
      </div>
    );
  }

  const perDay = Math.ceil(remainingTopics.length / crashDays);
  const crashPlan = [];

  for (let i = 0; i < crashDays; i++) {
    const dayTopics = remainingTopics.slice(i * perDay, (i + 1) * perDay);
    if (dayTopics.length > 0) {
      crashPlan.push({ day: i + 1, topics: dayTopics });
    }
  }

  return (
    <div className="page-container gradient-bg">
      <motion.div
        className="card frosted-glass"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="login-title">🚨 Crash Revision Plan</h2>
        <motion.div className="summary-box vibrant-shadow">
          <p><strong>⏱ Total Remaining Topics:</strong> {remainingTopics.length}</p>
          <p><strong>🧪 Days Left:</strong> {crashDays}</p>
        </motion.div>

        <div className="timeline-container">
          {crashPlan.map((entry) => (
            <motion.div
              key={entry.day}
              className="timeline-card neon-box"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: entry.day * 0.05 }}
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
          <button className="button-outline" onClick={() => navigate('/track')}>
            ⬅️ Back to Progress
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CrashPlan;