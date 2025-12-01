import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CareerForm from "./CareerForm";

function CareerCounselor({ user }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.analysis) {
      setResult(location.state.analysis.recommendation);
    }
  }, [location.state]);

  const handleCareerSubmit = async (formData) => {
    setLoading(true);
    setResult("🔍 Analyzing your profile... Generating comprehensive career recommendations...");

    try {
      const userInput = `
        COMPREHENSIVE CAREER PROFILE ANALYSIS:

        🎯 PRIMARY INTERESTS: ${formData.interests}
        💪 KEY STRENGTHS: ${formData.strengths}
        🎓 EDUCATION LEVEL: ${formData.education}
        💼 WORK EXPERIENCE: ${formData.experience}
        🎯 CAREER GOALS: ${formData.goals}
        👥 WORK STYLE: ${formData.workStyle}
        📍 LOCATION PREFERENCE: ${formData.location}
        💰 SALARY EXPECTATIONS: ${formData.salary}
        📝 ADDITIONAL NOTES: ${formData.note || "None provided"}

        Please provide EXTREMELY DETAILED career guidance...
      `;

      const response = await fetch("http://localhost:5000/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();

      if (response.ok) {
        const careerResult = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...formData,
          recommendation: data.recommendation,
        };

        // Save to database
        await saveCareerAnalysisToDB(user.id, careerResult);

        // NAVIGATE to dedicated result page (passes careerResult via location.state)
        navigate("/career-result", { state: { careerResult } });
      } else {
        setResult(`❌ Error: ${data.error || "Unknown error occurred"}`);
      }
    } catch (error) {
      setResult(`🌐 Network Error: ${error.message}. Please ensure the backend server is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  const saveCareerAnalysisToDB = async (userId, analysisData) => {
    try {
      const response = await fetch("http://localhost:5000/api/career-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          analysis_data: analysisData
        }),
      });

      if (!response.ok) {
        console.error("Failed to save career analysis to database");
      }
    } catch (error) {
      console.error("Error saving to database:", error);
    }
  };

  return (
    <div className="career-counselor-container">
      <header className="career-header">
        <div className="header-content">
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>🎯 AI Career Counselor</h1>
          <span>Welcome, {user.fullName}!</span>
        </div>
      </header>

      <div className="career-content">
        <div className="career-form-section">
          <CareerForm 
            onSubmit={handleCareerSubmit} 
            loading={loading}
            initialData={location.state?.analysis}
          />
        </div>

        {result && (
          <div className="result-section">
            <h2>📋 Your Personalized Career Analysis</h2>
            <div className="result-content">
              {result.split('\n').map((line, index) => {
                if (line.includes('🎯') || line.includes('💼') || line.includes('📚') || line.includes('🗓️') || line.includes('🌟')) {
                  return <h4 key={index} className="section-header">{line}</h4>;
                } else if (line.includes('**') && line.includes(':**')) {
                  return <h5 key={index} className="subsection-header">{line.replace(/\*\*/g, '')}</h5>;
                } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return <div key={index} className="list-item">{line}</div>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <div key={index} className="normal-line">{line}</div>;
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerCounselor;