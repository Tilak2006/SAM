// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import StudentDashboard from './dashboard/s_dashboard';
import StudentLogin from './components/s_login';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Protected_route';

function AppWrapper() {
  const location = useLocation();
  const { currentUser } = useAuth(); // New: No longer destructuring studentInfo here
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isAuthPage = location.pathname === '/' || location.pathname === '/signup';

  return (
    <div className="app">
      {!isAuthPage && (
        <Navbar
          // Removed studentInfo prop
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={currentUser ? <Navigate to="/dashboard" replace /> : <StudentLogin />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;