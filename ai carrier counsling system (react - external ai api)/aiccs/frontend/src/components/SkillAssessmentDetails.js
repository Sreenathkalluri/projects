import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SkillAssessmentDetails({ user }) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadSkillAssessment();
  }, [id]);

  const loadSkillAssessment = async () => {
    try {
      // Load all skill assessments for the user
      const response = await fetch(`http://localhost:5000/api/skill-assessment/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Find the specific assessment by ID
        const foundAssessment = data.assessments.find(a => a.id === parseInt(id));
        if (foundAssessment) {
          setAssessment(foundAssessment);
        }
      }
    } catch (error) {
      console.error("Error loading skill assessment:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading) {
    return (
      <div className="skill-details-container">
        <header className="details-header">
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Loading Skill Assessment...</h1>
        </header>
        <div className="loading-state">
          <div className="loading-spinner">📊</div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="skill-details-container">
        <header className="details-header">
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Assessment Not Found</h1>
        </header>
        <div className="error-state">
          <p>The requested skill assessment could not be found.</p>
          <button onClick={() => navigate("/dashboard")} className="cta-button">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-details-container">
      <header className="details-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Skill Assessment Details</h1>
        <span className="assessment-date">{formatDate(assessment.created_at)}</span>
      </header>

      <div className="skill-details-content">
        {/* Score Overview */}
        <div className="score-overview">
          <div className="score-circle-large">
            <div 
              className="score-circle-inner"
              style={{ 
                background: `conic-gradient(${getScoreColor(assessment.score)} ${(assessment.score / 10) * 360}deg, #374151 0deg)` 
              }}
            >
              <span className="score-value-large">{assessment.score}</span>
              <span className="score-label-large">/10</span>
            </div>
          </div>
          <div className="score-details">
            <h2>{assessment.skill} Assessment</h2>
            <div className="level-badge" style={{ backgroundColor: getScoreColor(assessment.score) }}>
              {getLevelFromScore(assessment.score)}
            </div>
            <p><strong>Questions Completed:</strong> {assessment.questions_answered}/{assessment.total_questions}</p>
            <p><strong>Assessment Date:</strong> {formatDate(assessment.created_at)}</p>
          </div>
        </div>

        {/* Analysis */}
        <div className="details-section">
          <h2>📊 Skill Analysis</h2>
          <div className="analysis-content">
            {assessment.analysis && assessment.analysis.split('\n').map((line, index) => {
              if (line.includes('🎯') || line.includes('📊') || line.includes('✅') || line.includes('🔍') || line.includes('💡') || line.includes('🚀')) {
                return <h3 key={index} className="section-header">{line}</h3>;
              } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                return <div key={index} className="list-item">{line}</div>;
              } else if (line.trim() === '') {
                return <br key={index} />;
              } else {
                return <p key={index} className="normal-line">{line}</p>;
              }
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="details-actions">
          <button 
            onClick={() => navigate("/skills-assessment")}
            className="cta-button primary"
          >
            🔄 Retake Assessment
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            className="cta-button secondary"
          >
            📋 Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default SkillAssessmentDetails;