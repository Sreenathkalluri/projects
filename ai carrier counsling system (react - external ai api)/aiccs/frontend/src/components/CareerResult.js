import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CareerResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const careerResult = location.state?.careerResult;

  if (!careerResult) {
    return (
      <div className="career-result-container">
        <p>No result data available.</p>
        <button onClick={() => navigate("/career")}>← Back</button>
      </div>
    );
  }

  const { recommendation, timestamp, interests, strengths, education } = careerResult;
  return (
    <div className="career-result-container">
      <header className="career-result-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">← Back to Dashboard</button>
        <h1>📋 Career Recommendation</h1>
        <span>{new Date(timestamp).toLocaleString()}</span>
      </header>

      <section className="profile-summary">
        <h3>Profile Summary</h3>
        <div>Interests: {interests}</div>
        <div>Strengths: {strengths}</div>
        <div>Education: {education}</div>
      </section>

      <section className="recommendation">
        <h3>Recommendation</h3>
        <div className="recommendation-content">
          {recommendation.split('\n').map((line, idx) => {
            if (line.trim() === "") return <br key={idx} />;
            if (line.startsWith("•") || line.startsWith("-")) return <div key={idx} className="list-item">{line}</div>;
            if (line.includes('🎯')||line.includes('💼')||line.includes('📚')) return <h4 key={idx}>{line}</h4>;
            return <div key={idx}>{line}</div>;
          })}
        </div>
      </section>

      <footer className="result-actions">
        <button onClick={() => navigate(-1)}>← Back</button>
        <button onClick={() => window.print()}>Print / Save PDF</button>
      </footer>
    </div>
  );
}

export default CareerResult;