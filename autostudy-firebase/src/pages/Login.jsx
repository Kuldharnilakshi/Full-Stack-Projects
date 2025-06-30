import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig'; // 👈 You'll create this file
import '../styles.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.email.split('@')[0]); // optional

      alert('✅ Login successful!');
      navigate('/home1');
    } catch (error) {
      alert('❌ Login failed: ' + error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="login-title">Login to AutoStudy</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="button-purple" type="submit">Login</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          New user?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#B026FF', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
