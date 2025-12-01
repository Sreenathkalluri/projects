import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import CareerCounselor from "./components/CareerCounselor";
import SkillsAssessment from "./components/SkillsAssessment";
import CareerAnalysisDetails from "./components/CareerAnalysisDetails";
import SkillAssessmentDetails from "./components/SkillAssessmentDetails";
import CareerResult from "./components/CareerResult";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("careerUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("careerUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("careerUser");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🎯</div>
        <p>Loading CareerPath AI...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              user ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/career-counselor" 
            element={
              user ? <CareerCounselor user={user} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/skills-assessment" 
            element={
              user ? <SkillsAssessment user={user} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/career-analysis/:id" 
            element={
              user ? <CareerAnalysisDetails user={user} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/skill-assessment/:id" 
            element={
              user ? <SkillAssessmentDetails user={user} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/career" 
            element={
              user ? <CareerCounselor user={user} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/career-result" 
            element={
              user ? <CareerResult /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;