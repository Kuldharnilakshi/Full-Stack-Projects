import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles.css';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function Upload() {
  const [topics, setTopics] = useState([]);
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const navigate = useNavigate();

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.text) {
        alert('❌ No content found in the uploaded PDF.');
        return;
      }

      const lines = data.text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length === 0) {
        alert('❌ PDF parsed, but no topics found.');
        return;
      }

      setTopics(lines);
      alert('✅ PDF uploaded and topics extracted!');
    } catch (err) {
      alert('❌ Failed to upload or parse PDF.');
      console.error(err);
    }
  };

  const handleTextInput = (e) => {
    const text = e.target.value;
    const extractedTopics = text.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    setTopics(extractedTopics);
  };

  const handleGeneratePlan = async () => {
    if (!examDate || topics.length === 0) {
      alert("Please enter exam date and topics.");
      return;
    }

    const exam = new Date(examDate);
    const today = new Date();
    const diffDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      alert("Enter a valid future exam date.");
      return;
    }

    const topicsPerDay = Math.ceil(topics.length / diffDays);
    const plan = [];

    for (let i = 0; i < diffDays; i++) {
      const dayTopics = topics.slice(i * topicsPerDay, (i + 1) * topicsPerDay);
      if (dayTopics.length > 0) {
        plan.push({ day: i + 1, topics: dayTopics });
      }
    }

    localStorage.setItem('examDate', examDate);
    localStorage.setItem('userPlan', JSON.stringify(plan));
    localStorage.setItem('completedTopics', JSON.stringify([]));

    const userName = localStorage.getItem('userName') || 'Guest';
    const userEmail = localStorage.getItem('userEmail');

    // Save to localStorage history
    const oldUploadPlans = JSON.parse(localStorage.getItem('uploadPlansHistory')) || [];
    const newUploadPlan = {
      date: new Date().toLocaleString(),
      plan: plan
    };
    localStorage.setItem('uploadPlansHistory', JSON.stringify([newUploadPlan, ...oldUploadPlans]));

    // Save to Firestore
    try {
      await addDoc(collection(db, "studyPlans"), {
        name: userName,
        email: userEmail,
        examDate,
        studyHours: hoursPerDay,
        plan,
        completedTopics: [],
        createdAt: Timestamp.now(),
      });
      console.log("✅ Study plan saved to Firestore.");
    } catch (error) {
      console.error("❌ Error saving plan:", error);
      alert("Failed to save plan to Firestore. Please try again.");
      return;
    }

    navigate('/plan', {
      state: {
        plan,
        examDate,
        hoursPerDay,
        totalTopics: topics.length,
        completed: 0,
      },
    });
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="card glass-card"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
      >
        <h2 className="login-title">📄 Upload Your Syllabus</h2>

        <label htmlFor="pdf-upload" className="custom-file-upload">📂 Choose PDF File</label>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handlePdfUpload}
          className="file-input-hidden"
        />

        <br />

        <label>Paste Syllabus Text (one topic per line):</label>
        <textarea
          onChange={handleTextInput}
          placeholder="e.g., Introduction to OS\nCPU Scheduling\nMemory Management"
          rows="6"
          className="textarea-input"
        />

        <label>📅 Exam Date:</label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="input-box"
        />

        <label>⏰ Daily Study Hours:</label>
        <input
          type="number"
          min="1"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(e.target.value)}
          className="input-box"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          className="button-purple"
          onClick={handleGeneratePlan}
        >
          📅 Generate Study Plan
        </motion.button>

        {topics.length > 0 && (
          <motion.div
            className="topics-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h4>Extracted Topics Preview ({topics.length}):</h4>
            <ul>
              {topics.slice(0, 5).map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
              {topics.length > 5 && <li>...and more</li>}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Upload;
