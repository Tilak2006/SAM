// src/components/navbar.jsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './navbar.css';

// Remove the `studentInfo` prop since we're getting it from the context
const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // New: Get the full user object from the context
  const { currentUser, studentInfo, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to={currentUser ? '/studentDashboard' : '/'} className="brand-link">
            <span className="brand-text">SAM</span>
            <span className="brand-subtitle">Student Attendance Manager</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Main navigation links */}
          <div className="nav-links">
            {currentUser && (
              <>
                <Link
                  to="/studentDashboard"
                  className={`nav-link ${isActive('/studentDashboard') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* User info and logout button */}
          {currentUser ? (
            <div className="user-menu">
              <button
                className="nav-button theme-toggle-btn"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>
              <div className="user-info">
                {/* Access data directly from the user object */}
                <div className="user-name">{studentInfo?.name || ''}</div>
                <div className="user-role">
                  {studentInfo?.semester || ''} {studentInfo?.rollNumber || ''}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="nav-button logout-btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <button
                onClick={() => navigate('/')}
                className="nav-button login-btn"
              >
                Login
              </button>
            </div>
          )}
        </div>

        <button className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;