// src/components/s_login.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // New: Import useAuth
import { FiSun, FiMoon } from 'react-icons/fi';
import "./s_login.css";

const StudentLogin = () => {
  const { login, signup, currentUser } = useAuth(); // New: Destructure login and signup from context
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    roll: "",
    name: "",
    email: "",
    password: "",
    semester: ""
  });
  const [error, setError] = useState('');

  // Auto-navigate if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/studentDashboard');
    }
  }, [currentUser, navigate]);

  const toggleTheme = () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let result;
    if (isSignup) {
      result = await signup(formData.email, formData.password, {
        roll: formData.roll,
        name: formData.name,
        semester: formData.semester
      });
    } else {
      result = await login(formData.email, formData.password);
    }

    if (result.success) {
      navigate('/studentDashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        <FiSun size={16} />
        <span>•</span>
        <FiMoon size={16} />
      </button>

      <div className="login-form">
        <h2>{isSignup ? "Student Signup" : "Student Login"}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Roll Number</label>
            <input 
              type="text" 
              name="roll" 
              placeholder="Format: S1_001" 
              value={formData.roll} 
              onChange={handleChange} 
              required 
            />
          </div>

          {isSignup && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Semester</label>
                <input 
                  type="text" 
                  name="semester" 
                  placeholder="e.g., 1st, 2nd, 3rd..." 
                  value={formData.semester} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
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
              placeholder="Enter your password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="login-btn">
            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => setIsSignup(!isSignup)}>
          {isSignup 
            ? "Already have an account? Sign in here" 
            : "Don't have an account? Sign up here"
          }
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;