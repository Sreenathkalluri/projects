import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard({ user, onLogout }) {
  const [careerHistory, setCareerHistory] = useState([]);
  const [skillAssessments, setSkillAssessments] = useState([]);
  const [stats, setStats] = useState({
    career_analyses: 0,
    skill_assessments: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("career");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard data from backend
      const dashboardResponse = await fetch(`http://localhost:5000/api/dashboard/${user.id}`);
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setStats(dashboardData.stats);
        setSkillAssessments(dashboardData.recent_assessments || []);
      }

      // Load career analyses from backend
      const careerResponse = await fetch(`http://localhost:5000/api/career-analysis/${user.id}`);
      if (careerResponse.ok) {
        const careerData = await careerResponse.json();
        setCareerHistory(careerData.analyses || []);
      }

      // Load skill assessments from backend
      const skillsResponse = await fetch(`http://localhost:5000/api/skill-assessment/${user.id}`);
      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json();
        setSkillAssessments(skillsData.assessments || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback to localStorage if backend fails
      const savedHistory = localStorage.getItem("careerHistory");
      if (savedHistory) {
        setCareerHistory(JSON.parse(savedHistory));
        setStats(prev => ({ ...prev, career_analyses: JSON.parse(savedHistory).length }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const clearHistory = async () => {
    try {
      if (activeTab === "career") {
        setCareerHistory([]);
        setStats(prev => ({ ...prev, career_analyses: 0 }));
        localStorage.removeItem("careerHistory");
      } else {
        setSkillAssessments([]);
        setStats(prev => ({ ...prev, skill_assessments: 0 }));
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    const num = parseFloat(score);
    if (num >= 8.5) return "#10b981";
    if (num >= 7) return "#3b82f6";
    if (num >= 5) return "#f59e0b";
    if (num >= 3) return "#f97316";
    return "#ef4444";
  };

  const getLevelFromScore = (score) => {
    const num = parseFloat(score);
    if (num >= 8.5) return "Expert";
    if (num >= 7) return "Advanced";
    if (num >= 5) return "Intermediate";
    if (num >= 3) return "Beginner";
    return "Novice";
  };

  const getScoreEmoji = (score) => {
    const num = parseFloat(score);
    if (num >= 8.5) return "🏆";
    if (num >= 7) return "🚀";
    if (num >= 5) return "💪";
    if (num >= 3) return "📚";
    return "🌱";
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>🎯 CareerPath AI Dashboard</h1>
            <div className="user-menu">
              <span>Welcome, {user.fullName}!</span>
              <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
            </div>
          </div>
        </header>
        <div className="dashboard-content">
          <div className="loading-state">
            <div className="loading-spinner">📊</div>
            <p>Loading your dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🎯 CareerPath AI Dashboard</h1>
          <div className="user-menu">
            <span>Welcome, {user.fullName}!</span>
            <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Card */}
        <div className="welcome-card">
          <div className="welcome-content">
            <h2>Hello, {user.fullName}! 👋</h2>
            <p>Track your career development and skill growth.</p>
            <div className="action-buttons">
              <Link to="/career-counselor" className="cta-button primary">
                🚀 Career Analysis
              </Link>
              <Link to="/skills-assessment" className="cta-button secondary">
                📊 Skills Test
              </Link>
            </div>
          </div>
          <div className="welcome-stats">
            <div className="stat">
              <h3>{stats.career_analyses}</h3>
              <p>Career Analyses</p>
            </div>
            <div className="stat">
              <h3>{stats.skill_assessments}</h3>
              <p>Skill Tests</p>
            </div>
            <div className="stat">
              <h3>{careerHistory.length + skillAssessments.length}</h3>
              <p>Total</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === "career" ? "active" : ""}`}
            onClick={() => setActiveTab("career")}
          >
            📋 Career ({careerHistory.length})
          </button>
          <button 
            className={`tab-button ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            📊 Skills ({skillAssessments.length})
          </button>
        </div>

        {/* Career Analyses Tab */}
        {activeTab === "career" && (
          <div className="analyses-section">
            <div className="section-header">
              <h2>Career Analyses</h2>
              {careerHistory.length > 0 && (
                <button onClick={clearHistory} className="clear-btn">
                  🗑️ Clear
                </button>
              )}
            </div>

            {careerHistory.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3>No career analyses</h3>
                <p>Start your first career analysis.</p>
                <Link to="/career-counselor" className="cta-button">
                  Start Analysis
                </Link>
              </div>
            ) : (
              <div className="analyses-grid">
  {careerHistory.map((analysis) => (
      <div 
        key={analysis.id} 
        className="analysis-card career-card"
        onClick={() => navigate(`/career-analysis/${analysis.id}`)}
        style={{cursor: 'pointer'}}
      >
        <div className="analysis-header">
          <h4>{analysis.interests}</h4>
          <span className="analysis-date">
            {formatDate(analysis.created_at)}
          </span>
        </div>
        <div className="analysis-details">
          <p><strong>Focus:</strong> {analysis.interests}</p>
          <p><strong>Goals:</strong> {analysis.goals}</p>
        </div>
      </div>
    ))}
  </div>
            )}
          </div>
        )}

        {/* Skill Assessments Tab */}
        {activeTab === "skills" && (
          <div className="analyses-section">
            <div className="section-header">
              <h2>Skill Tests</h2>
              {skillAssessments.length > 0 && (
                <button onClick={clearHistory} className="clear-btn">
                  🗑️ Clear
                </button>
              )}
            </div>

            {skillAssessments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No skill tests</h3>
                <p>Take your first skill assessment.</p>
                <Link to="/skills-assessment" className="cta-button">
                  Start Test
                </Link>
              </div>
            ) : (
        <div className="analyses-grid">
          {skillAssessments.map((assessment) => (
            <div 
              key={assessment.id} 
              className="analysis-card skill-card"
              onClick={() => navigate(`/skill-assessment/${assessment.id}`)}
              style={{cursor: 'pointer'}}
            >
              <div className="skill-header">
                <div className="skill-title">
                  <h4>{assessment.skill}</h4>
                  <span className="skill-emoji">{getScoreEmoji(assessment.score)}</span>
                </div>
                <div className="score-display">
                  <span className="score-value">{assessment.score}</span>
                  <span className="score-label">/10</span>
                </div>
              </div>
              
              <div className="skill-details">
                <div className="skill-level" style={{ color: getScoreColor(assessment.score) }}>
                  {getLevelFromScore(assessment.score)}
                </div>
                <p className="assessment-date">{formatDate(assessment.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/career-counselor" className="action-card">
              <div className="action-icon">🎯</div>
              <h3>Career Analysis</h3>
              <p>Get career recommendations</p>
            </Link>
            
            <Link to="/skills-assessment" className="action-card">
              <div className="action-icon">📊</div>
              <h3>Skills Test</h3>
              <p>Evaluate your skills</p>
            </Link>

            <div className="action-card info-card">
              <div className="action-icon">📈</div>
              <h3>Progress</h3>
              <p><strong>Analyses:</strong> {stats.career_analyses}</p>
              <p><strong>Tests:</strong> {stats.skill_assessments}</p>
              <p><strong>Avg Score:</strong> {
                skillAssessments.length > 0 
                  ? (skillAssessments.reduce((sum, a) => sum + a.score, 0) / skillAssessments.length).toFixed(1)
                  : '0'
              }/10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;