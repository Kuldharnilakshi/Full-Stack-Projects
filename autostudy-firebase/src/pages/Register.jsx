import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

function Register() {
  const navigate = useNavigate();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password, confirm } = formData;

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Optional: Save user profile to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email
      });

      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);

      alert("✅ Registered successfully!");
      navigate('/home1');
    } catch (error) {
      alert("❌ Registration failed: " + error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="login-title">Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="input-box"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="input-box"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="input-box"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              className="input-box"
              value={formData.confirm}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="button-purple">Register</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#B026FF', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
