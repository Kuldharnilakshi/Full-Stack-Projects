import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Plan from './pages/Plan';
import Track from './pages/Track';
import CrashPlan from './pages/CrashPlan';
import Profile from './pages/Profile';
import Home1 from './pages/Home1';
import SmartPlanner from './pages/SmartPlanner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home1" element={<Home1 />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/track" element={<Track />} />
        <Route path="/crashplan" element={<CrashPlan />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/smart-planner" element={<SmartPlanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
