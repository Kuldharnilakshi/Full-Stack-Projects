import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function Track() {
  const navigate = useNavigate();
  const [width, height] = useWindowSize();

  const [uploadedPlan, setUploadedPlan] = useState([]);
  const [aiPlan, setAiPlan] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);

  useEffect(() => {
    const upload = JSON.parse(localStorage.getItem('userPlan')) || [];
    const ai = JSON.parse(localStorage.getItem('studyPlan')) || [];
    const completed = JSON.parse(localStorage.getItem('completedTopics')) || [];

    setUploadedPlan(upload);
    setAiPlan(ai);
    setCompletedTopics(completed);
  }, []);

  const toggleTopicStatus = (planType, dayIndex, topic) => {
    const key = `${planType}-${dayIndex}-${topic}`;
    const updated = completedTopics.includes(key)
      ? completedTopics.filter(t => t !== key)
      : [...completedTopics, key];

    setCompletedTopics(updated);
    localStorage.setItem('completedTopics', JSON.stringify(updated));
  };

  const isTopicDone = (planType, dayIndex, topic) =>
    completedTopics.includes(`${planType}-${dayIndex}-${topic}`);

  const calculateProgress = (plan, planType) => {
    const total = plan.reduce((acc, day) => acc + (day.topics?.length || day.tasks?.length || 0), 0);
    const done = plan.reduce((acc, day, i) => {
      const items = day.topics || day.tasks || [];
      return acc + items.filter(t => {
        const topicName = typeof t === 'string' ? t : t.name;
        return isTopicDone(planType, i, topicName);
      }).length;
    }, 0);
    return {
      total,
      completed: done,
      percentage: total === 0 ? 0 : Math.round((done / total) * 100)
    };
  };

  const handleCrashPlanRedirect = () => {
    const examDate = localStorage.getItem('examDate');
    if (!examDate) {
      alert("📅 Exam date not found.");
      return;
    }

    const today = new Date();
    const exam = new Date(examDate);
    const remainingDays = Math.max(Math.ceil((exam - today) / (1000 * 60 * 60 * 24)), 1);

    const remainingTopics = [];
    aiPlan.forEach((day, i) => {
      (day.tasks || []).forEach(task => {
        const name = task.name || task;
        const key = `ai-${i}-${name}`;
        if (!completedTopics.includes(key)) {
          remainingTopics.push(name);
        }
      });
    });

    if (remainingTopics.length === 0) {
      alert("🎉 No crash plan needed. You've completed everything!");
      return;
    }

    const topicsPerDay = Math.ceil(remainingTopics.length / remainingDays);
    const crashPlan = [];

    for (let i = 0; i < remainingDays; i++) {
      crashPlan.push({
        day: i + 1,
        topics: remainingTopics.slice(i * topicsPerDay, (i + 1) * topicsPerDay)
      });
    }

    navigate('/crashplan', {
      state: {
        plan: crashPlan,
        totalTopics: remainingTopics.length,
        remainingDays
      }
    });
  };

  const renderPlanCard = (label, plan, planType, allowCrash = false) => {
    const progress = calculateProgress(plan, planType);
    const topicsKey = planType === 'ai' ? 'tasks' : 'topics';

    const chartData = progress.completed > 0
      ? [
          { name: 'Completed', value: progress.completed },
          { name: 'Remaining', value: progress.total - progress.completed }
        ]
      : [{ name: 'Remaining', value: progress.total }];

    return (
      <div className="card1">
        <h2 className="login-title">{label}</h2>
        <p style={{ textAlign: 'center' }}>
          ✅ {progress.completed} of {progress.total} topic(s) completed
        </p>

        <div style={{ margin: '30px auto', textAlign: 'center' }}>
          <h4 style={{ marginBottom: '15px', color: '#B026FF' }}>
            {progress.percentage}% Complete
          </h4>
          <PieChart width={300} height={250}>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {progress.completed > 0 && <Cell fill="#B026FF" />}
              <Cell fill="#E0E0E0" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {progress.percentage === 100 && (
          <>
            <Confetti width={width} height={height * 2} numberOfPieces={500} recycle={false} />
            <div className="congrats-modal">
              <div className="congrats-content">
                <h2>🎉 Congratulations!</h2>
                <p>You've completed your entire study plan! You're unstoppable! 🚀</p>
                <p className="celebrate-text">Now go shine in your exams. 💯✨</p>
              </div>
            </div>
          </>
        )}

        {progress.percentage < 70 && progress.total > 0 && allowCrash && (
          <div className="alert-card">
            <h3>⏳ Don’t Give Up!</h3>
            <p>You’ve completed only {progress.percentage}% of your plan.</p>
          </div>
        )}

        {plan.map((day, dayIndex) => (
          <div key={dayIndex} className="day-plan">
            <h3>📅 {day.day || `Day ${dayIndex + 1}`}</h3>
            <ul>
              {(day[topicsKey] || []).map((item, i) => {
                const topicName = typeof item === 'string' ? item : item.name;
                return (
                  <li
                    key={i}
                    className={`checklist-item ${isTopicDone(planType, dayIndex, topicName) ? 'glow' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isTopicDone(planType, dayIndex, topicName)}
                      onChange={() => toggleTopicStatus(planType, dayIndex, topicName)}
                    />
                    {topicName}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* 💡 Button section inside each card */}
        <div className="button-group">
          {allowCrash && (
            <button className="button-purple" onClick={handleCrashPlanRedirect}>
              ⚡ Generate Crash Plan
            </button>
          )}
          <button className="button-outline" onClick={() => navigate('/home1')}>
            🏠 Home
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container soft-purple-bg">
      <div className="track-plan-container">
        {uploadedPlan.length > 0 && renderPlanCard('📁 Uploaded Plan', uploadedPlan, 'upload', true)}
{aiPlan.length > 0 && renderPlanCard('🤖 AI Generated Plan', aiPlan, 'ai', true)}
<div className="fade-purple"></div>
      </div>
    </div>
  );
}

export default Track;
