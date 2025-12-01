import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CareerAnalysisDetails({ user }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadCareerAnalysis();
  }, [id]);

  const loadCareerAnalysis = async () => {
    try {
      // Load all career analyses for the user
      const response = await fetch(`http://localhost:5000/api/career-analysis/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Find the specific analysis by ID
        const foundAnalysis = data.analyses.find(a => a.id === parseInt(id));
        if (foundAnalysis) {
          setAnalysis(foundAnalysis);
        }
      }
    } catch (error) {
      console.error("Error loading career analysis:", error);
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

  if (loading) {
    return (
      <div className="career-details-container">
        <header className="details-header">
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Loading Career Analysis...</h1>
        </header>
        <div className="loading-state">
          <div className="loading-spinner">📊</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="career-details-container">
        <header className="details-header">
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Analysis Not Found</h1>
        </header>
        <div className="error-state">
          <p>The requested career analysis could not be found.</p>
          <button onClick={() => navigate("/dashboard")} className="cta-button">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="career-details-container">
      <header className="details-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Career Analysis Details</h1>
        <span className="analysis-date">{formatDate(analysis.created_at)}</span>
      </header>

      <div className="career-details-content">
        {/* Profile Summary */}
        <div className="details-section">
          <h2>🎯 Profile Summary</h2>
          <div className="profile-grid">
            <div className="profile-item">
              <strong>Primary Interests:</strong>
              <span>{analysis.interests}</span>
            </div>
            <div className="profile-item">
              <strong>Key Strengths:</strong>
              <span>{analysis.strengths}</span>
            </div>
            <div className="profile-item">
              <strong>Education Level:</strong>
              <span>{analysis.education}</span>
            </div>
            <div className="profile-item">
              <strong>Work Experience:</strong>
              <span>{analysis.experience}</span>
            </div>
            <div className="profile-item">
              <strong>Career Goals:</strong>
              <span>{analysis.goals}</span>
            </div>
            {analysis.work_style && (
              <div className="profile-item">
                <strong>Work Style:</strong>
                <span>{analysis.work_style}</span>
              </div>
            )}
            {analysis.location && (
              <div className="profile-item">
                <strong>Location Preference:</strong>
                <span>{analysis.location}</span>
              </div>
            )}
            {analysis.salary && (
              <div className="profile-item">
                <strong>Salary Expectations:</strong>
                <span>{analysis.salary}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        {analysis.note && (
          <div className="details-section">
            <h2>📝 Additional Notes</h2>
            <div className="notes-content">
              <p>{analysis.note}</p>
            </div>
          </div>
        )}

        {/* Full Recommendation */}
        <div className="details-section">
          <h2>💼 Career Recommendations</h2>
          <div className="recommendation-content">
            {analysis.recommendation.split('\n').map((line, index) => {
              if (line.includes('🎯') || line.includes('📊') || line.includes('💼') || line.includes('🚀') || line.includes('📚') || line.includes('🌟')) {
                return <h3 key={index} className="section-header">{line}</h3>;
              } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                return <div key={index} className="list-item">{line}</div>;
              } else if (line.trim() === '') {
                return <br key={index} />;
              } else if (line.includes('**') && line.includes(':**')) {
                return <h4 key={index} className="subsection-header">{line.replace(/\*\*/g, '')}</h4>;
              } else {
                return <p key={index} className="normal-line">{line}</p>;
              }
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="details-actions">
          <button 
            onClick={() => navigate("/career-counselor")}
            className="cta-button primary"
          >
            🚀 New Career Analysis
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

export default CareerAnalysisDetails;