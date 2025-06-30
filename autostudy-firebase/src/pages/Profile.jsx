import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import profileImg from '../assets/profile.png';


function Profile() {
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || "Student Name";
  const userEmail = localStorage.getItem('userEmail') || "example@email.com";

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
      <div className="card" style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #e3f2fd, #ffffff)'
      }}>
        <img
         src={profileImg}
          alt="Profile"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            marginBottom: '15px',
            border: '3px solid #B026FF'
          }}
        />
        <h2 style={{ color: '#B026FF' }}>{userName}</h2>
        <p style={{ color: '#777', marginBottom: '20px' }}>{userEmail}</p>

        <button className="button-purple" onClick={() => navigate('/upload')}>📄 Upload Syllabus</button><br /><br />
        <button className="button-purple" onClick={() => navigate('/track')}>📊 Track Progress</button><br /><br />
        <button className="button-purple" onClick={() => navigate('/crashplan')}>⚡ Generate Crash Plan</button><br /><br />
        {/* <button className="button-outline" onClick={() => navigate('/savedplans')}>📚 View Saved Plans</button><br /><br /> */}

        <button className="button-outline" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
}

export default Profile;
