import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import difficultyData from '../assets/difficulty_data.json';
import '../styles.css';

const SmartPlanner = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState('');
  const [examDate, setExamDate] = useState('');
  const [matchedTopics, setMatchedTopics] = useState([]);
  const [manualDifficulty, setManualDifficulty] = useState({});
  const [plan, setPlan] = useState([]);

  const handleMatchTopics = () => {
  const topicList = topics
    .split(',')
    .map(topic => topic.trim())
    .filter(Boolean);

  const matched = topicList.map(inputTopic => {
    const matchedKey = Object.keys(difficultyData).find(
      key => key.toLowerCase() === inputTopic.toLowerCase()
    );
    return {
      name: inputTopic,
      difficulty: matchedKey ? difficultyData[matchedKey] : '',
      isPredefined: !!matchedKey
    };
  });

  setMatchedTopics(matched);
  setPlan([]);
};


  const handleManualDifficultyChange = (topicName, value) => {
    setManualDifficulty(prev => ({ ...prev, [topicName]: value }));
  };

  const handleGeneratePlan = () => {
    const today = new Date();
    const exam = new Date(examDate);
    const remainingDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

    if (!examDate || remainingDays <= 0) {
      alert('Please enter a valid future exam date.');
      return;
    }

    const unresolved = matchedTopics.filter(
      (t) => !t.difficulty && !manualDifficulty[t.name]
    );
    if (unresolved.length > 0) {
      alert('Please assign difficulty to all unknown topics.');
      return;
    }

    const finalTopics = matchedTopics.map(topic => ({
      name: topic.name,
      difficulty: topic.difficulty || manualDifficulty[topic.name]
    }));

    const planArray = Array.from({ length: remainingDays }, (_, i) => ({
      day: `Day ${i + 1}`,
      tasks: []
    }));

    finalTopics.forEach((topic, index) => {
      const dayIndex = index % remainingDays;
      planArray[dayIndex].tasks.push(topic);
    });

    setPlan(planArray);

    const oldPlans = JSON.parse(localStorage.getItem('aiPlansHistory')) || [];
    const newPlan = {
      date: new Date().toLocaleString(),
      plan: planArray
    };
    localStorage.setItem('aiPlansHistory', JSON.stringify([newPlan, ...oldPlans]));
    localStorage.setItem('studyPlan', JSON.stringify(planArray));
    localStorage.setItem('examDate', examDate);
  };

  return (
    <div className="smartplanner-wrapper">
      <div className="smart-planner-container">
        <h2 className="smart-heading">📘 AI-Based Smart Study Planner</h2>

        <div className="input-section">
          <label>📅 Enter Exam Date:</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />

          <label style={{ marginTop: '1rem' }}>📝 Enter Topics (comma-separated):</label>
          <textarea
            placeholder=""
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
          <button className="primary-button" onClick={handleMatchTopics}>🧠 Detect Topics</button>
        </div>

        {matchedTopics.length > 0 && (
          <div className="matched-topics">
            <h3>🧾 Review & Set Difficulty</h3>
            <table className="topic-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {matchedTopics.map((topic, i) => (
                  <tr key={i}>
                    <td>{topic.name}</td>
                    <td>
                      {topic.isPredefined ? (
                        <span className={`tag ${topic.difficulty.toLowerCase()}`}>
                          {topic.difficulty}
                        </span>
                      ) : (
                        <select
                          value={manualDifficulty[topic.name] || ''}
                          className={`select-tag ${manualDifficulty[topic.name]?.toLowerCase() || ''}`}
                          onChange={(e) =>
                            handleManualDifficultyChange(topic.name, e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="primary-button" onClick={handleGeneratePlan}>📅 Generate Study Plan</button>
          </div>
        )}

        {plan.length > 0 && (
          <div className="plan-section">
            <h3>📚 Your Study Plan (Saved to Track Page)</h3>
            <div className="weekly-plan-grid">
              {plan.map((dayPlan, index) => (
                <div key={index} className="day-card">
                  <h4>{dayPlan.day}</h4>
                  <ul>
                    {dayPlan.tasks.map((task, i) => (
                      <li key={i}>
                        {task.name} —{' '}
                        <span className={`tag ${task.difficulty.toLowerCase()}`}>
                          {task.difficulty}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button className="primary-button" onClick={() => navigate('/track')}>
                📊 Go to Track Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartPlanner;
