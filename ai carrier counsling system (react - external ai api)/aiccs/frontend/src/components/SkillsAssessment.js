import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SkillsAssessment({ user }) {
  const [assessmentStage, setAssessmentStage] = useState("intro");
  const [currentSkill, setCurrentSkill] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [overallScore, setOverallScore] = useState(0);
  const navigate = useNavigate();

  const skillCategories = [
    {
      name: "Technical Skills",
      skills: ["Programming", "Data Analysis", "Cybersecurity", "Cloud Computing", "Web Development"]
    },
    {
      name: "Soft Skills", 
      skills: ["Communication", "Leadership", "Problem Solving", "Teamwork", "Time Management"]
    },
    {
      name: "Business Skills",
      skills: ["Project Management", "Strategic Planning", "Sales & Marketing", "Financial Analysis", "Negotiation"]
    },
    {
      name: "Creative Skills",
      skills: ["Design Thinking", "Content Creation", "UX/UI Design", "Innovation", "Visual Design"]
    }
  ];

  // Fixed function to save assessment results
  const saveAssessmentToDB = async (userId, assessmentData) => {
    try {
      // Validate required fields
      if (!userId || !assessmentData) {
        throw new Error("User ID and assessment data are required");
      }

      if (!assessmentData.skill || assessmentData.score === undefined) {
        throw new Error("Skill and score are required in assessment data");
      }

      console.log("📦 Saving assessment data for user:", userId);
      console.log("📊 Assessment data:", assessmentData);
      
      const payload = {
        user_id: userId,
        skill: assessmentData.skill,
        score: parseFloat(assessmentData.score),
        level: assessmentData.level || getScoreLevel(assessmentData.score),
        total_questions: parseInt(assessmentData.total_questions) || 0,
        questions_answered: parseInt(assessmentData.questions_answered) || 0,
        analysis: assessmentData.analysis || "",
        user_answers: assessmentData.user_answers || {},
        questions_used: assessmentData.questions_used || [],
        created_at: new Date().toISOString()
      };

      console.log("🚀 Sending payload:", payload);

      const response = await fetch("http://localhost:5000/api/skill-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log("✅ Assessment saved successfully:", result);
        return result;
      } else {
        console.error("❌ Failed to save assessment:", result);
        throw new Error(result.error || result.message || "Failed to save assessment");
      }
    } catch (error) {
      console.error("❌ Error saving to database:", error);
      throw error;
    }
  };

  // Generate questions with options using API
  const generateQuestionsWithAPI = async (skill) => {
    try {
      console.log(`🔄 Generating 10 questions for: ${skill}`);
      
      const response = await fetch("http://localhost:5000/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill: skill,
          numberOfQuestions: 10,
          includeOptions: true,
          questionTypes: ["multiple_choice", "scenario_based", "behavioral", "technical", "practical"]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Received ${data.questions?.length || 0} questions`);
        return data.questions || [];
      } else {
        console.error('❌ Questions API not available');
        throw new Error('Questions API not available');
      }
    } catch (error) {
      console.error('❌ Failed to generate questions:', error);
      throw new Error('Failed to generate questions');
    }
  };

  // Analyze results and get score out of 10 using API
  const analyzeResultsWithAPI = async (skill, userAnswers, questions) => {
    try {
      const response = await fetch("http://localhost:5000/api/analyze-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill: skill,
          userAnswers: userAnswers,
          questions: questions,
          user: {
            name: user?.fullName || "User",
            experience: "self-assessed"
          },
          scoring: {
            scale: 10,
            includeImprovement: true,
            includeResources: true
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          analysis: data.analysis,
          score: data.score,
          level: data.level,
          improvements: data.improvements
        };
      } else {
        throw new Error('Analysis API not available');
      }
    } catch (error) {
      throw new Error('Failed to analyze results');
    }
  };

  const startAssessment = async (skill) => {
    setCurrentSkill(skill);
    setAssessmentStage("questions");
    setLoading(true);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    
    try {
      console.log(`🚀 Starting assessment for: ${skill}`);
      const questionsData = await generateQuestionsWithAPI(skill);
      
      if (questionsData && questionsData.length > 0) {
        console.log(`📝 Setting ${questionsData.length} questions`);
        setQuestions(questionsData);
      } else {
        throw new Error('No questions received');
      }
    } catch (error) {
      console.error('❌ Error loading questions:', error);
      alert("Failed to load questions. Please try again.");
      setAssessmentStage("intro");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        answer: answer,
        question: currentQuestion.question,
        type: currentQuestion.type,
        options: currentQuestion.options
      }
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  // Fixed calculateResults function with better validation
  const calculateResults = async () => {
    setLoading(true);
    
    try {
      // Validate user data
      if (!user || !user.id) {
        throw new Error("User information is not available. Please log in again.");
      }

      const analysisData = await analyzeResultsWithAPI(currentSkill, userAnswers, questions);
      const score = analysisData.score || 7.5;
      setAnalysis(analysisData.analysis);
      setOverallScore(score);
      
      // Prepare assessment data with validation
      const assessmentData = {
        skill: currentSkill || "Unknown Skill",
        score: score,
        level: analysisData.level || getScoreLevel(score),
        total_questions: questions.length || 0,
        questions_answered: Object.keys(userAnswers).length || 0,
        analysis: analysisData.analysis || "No analysis available",
        user_answers: userAnswers || {},
        questions_used: questions || []
      };
      
      console.log("💾 Attempting to save assessment for user:", user.id);
      console.log("📊 Assessment data to save:", assessmentData);
      
      // Save to database
      await saveAssessmentToDB(user.id, assessmentData);
      
      console.log("🎉 Assessment completed and saved successfully!");
      setAssessmentStage("results");
    } catch (error) {
      console.error("❌ Error in calculateResults:", error);
      alert(`Failed to save results: ${error.message}`);
      // Optionally, you can still show results even if saving fails
      setAssessmentStage("results");
    } finally {
      setLoading(false);
    }
  };

  const restartAssessment = () => {
    setAssessmentStage("questions");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  const startNewSkill = () => {
    setAssessmentStage("intro");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setAnalysis("");
    setOverallScore(0);
    setCurrentSkill("");
    setQuestions([]);
  };

  const getScoreColor = (score) => {
    const num = parseFloat(score);
    if (num >= 9) return "#10b981";
    if (num >= 7) return "#3b82f6";
    if (num >= 5) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLevel = (score) => {
    const num = parseFloat(score);
    if (num >= 9) return "Expert";
    if (num >= 7) return "Advanced";
    if (num >= 5) return "Intermediate";
    return "Beginner";
  };

  // Check if backend is available
  const checkBackendStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health");
      const data = await response.json();
      console.log("🏥 Backend status:", data);
      return true;
    } catch (error) {
      console.error("❌ Backend is not available:", error);
      return false;
    }
  };

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  // Render different stages
  if (assessmentStage === "intro") {
    return (
      <div className="skills-assessment">
        <header className="assessment-header">
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>🎯 Skills Assessment</h1>
          <p>Evaluate your skills with 10 diverse questions and get AI-powered scoring out of 10</p>
          <div style={{marginTop: '10px', fontSize: '0.9rem', color: '#666'}}>
            User: {user?.fullName} (ID: {user?.id})
          </div>
        </header>

        <div className="skill-categories">
          {skillCategories.map(category => (
            <div key={category.name} className="skill-category">
              <h3>{category.name}</h3>
              <div className="skills-grid">
                {category.skills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => startAssessment(skill)}
                    className="skill-card"
                    disabled={loading}
                  >
                    <span className="skill-name">{skill}</span>
                    <span className="questions-count">10 questions</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="assessment-info">
          <h3>📝 How It Works</h3>
          <div className="info-steps">
            <div className="step">
              <div className="step-number">1</div>
              <p><strong>Select a skill</strong> - AI generates 10 diverse questions</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p><strong>Answer questions</strong> - Multiple choice, scenarios, technical, and practical questions</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p><strong>Get detailed analysis</strong> - Score out of 10 with personalized improvement plan</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (assessmentStage === "questions") {
    if (loading) {
      return (
        <div className="skills-assessment">
          <div className="loading-state">
            <div className="loading-spinner">🎯</div>
            <p>AI is generating your 10 assessment questions...</p>
            <p className="loading-subtext">Creating diverse question types for comprehensive assessment</p>
          </div>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="skills-assessment">
          <div className="error-state">
            <h3>No questions available</h3>
            <p>Please try selecting a different skill.</p>
            <button onClick={startNewSkill} className="action-btn">
              Back to Skills
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const getQuestionTypeIcon = (type) => {
      switch(type) {
        case 'multiple_choice': return '🔘';
        case 'scenario_based': return '🎭';
        case 'behavioral': return '🧠';
        case 'technical': return '⚙️';
        case 'practical': return '💻';
        default: return '❓';
      }
    };

    return (
      <div className="skills-assessment">
        <header className="assessment-header">
          <button onClick={startNewSkill} className="back-btn">
            ← Back to Skills
          </button>
          <h1>🔍 {currentSkill} Assessment</h1>
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        </header>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="question-card">
          <div className="question-header">
            <span className="question-type">
              {getQuestionTypeIcon(currentQuestion.type)} {currentQuestion.type?.replace('_', ' ').toUpperCase()}
            </span>
            <span className="question-number">Q{currentQuestionIndex + 1}/{questions.length}</span>
          </div>
          
          <h3>{currentQuestion.question}</h3>
          
          {currentQuestion.options && (
            <>
              <div className="options-grid">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="option-btn"
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="navigation-buttons">
          <button 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="nav-btn secondary"
          >
            ← Previous
          </button>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <button 
            onClick={() => handleAnswer("Skipped")}
            className="nav-btn secondary"
          >
            {currentQuestionIndex < questions.length - 1 ? "Skip" : "Finish"}
          </button>
        </div>
      </div>
    );
  }

  if (assessmentStage === "results") {
    if (loading) {
      return (
        <div className="skills-assessment">
          <div className="loading-state">
            <div className="loading-spinner">📊</div>
            <p>AI is analyzing your {questions.length} responses and generating score...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="skills-assessment">
        <header className="assessment-header">
          <h1>📊 Assessment Results: {currentSkill}</h1>
          <p>Based on your responses to {questions.length} questions</p>
        </header>

        <div className="results-container">
          <div className="score-display">
            <div className="score-circle">
              <div 
                className="score-value"
                style={{ color: getScoreColor(overallScore) }}
              >
                {overallScore}
              </div>
              <div className="score-label">/10</div>
              <div className="score-level">{getScoreLevel(overallScore)}</div>
            </div>
            <div className="score-breakdown">
              <h3>Skill Level: {getScoreLevel(overallScore)}</h3>
              <p>Questions Answered: {Object.keys(userAnswers).length}/{questions.length}</p>
              <p>Question Types: Multiple Choice, Scenarios, Behavioral, Technical, Practical</p>
            </div>
          </div>

          <div className="analysis-content">
            <h3>📈 AI Analysis & Improvement Plan</h3>
            {analysis ? (
              <div className="ai-analysis">
                {analysis.split('\n').map((line, index) => {
                  if (line.includes('🎯') || line.includes('📊') || line.includes('📈') || line.includes('💡') || line.includes('🌟') || line.includes('🔍') || line.includes('✅')) {
                    return <h4 key={index} className="section-header">{line}</h4>;
                  } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                    return <div key={index} className="list-item">{line}</div>;
                  } else if (line.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="normal-line">{line}</p>;
                  }
                })}
              </div>
            ) : (
              <div className="no-analysis">
                <p>Comprehensive analysis and improvement suggestions will be generated by AI based on your answers.</p>
              </div>
            )}
          </div>

          <div className="results-actions">
            <button onClick={restartAssessment} className="action-btn primary">
              🔄 Retake Assessment
            </button>
            <button onClick={startNewSkill} className="action-btn secondary">
              🎯 Assess Another Skill
            </button>
            <button onClick={() => navigate("/dashboard")} className="action-btn">
              📋 Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-assessment">
      <div className="loading-state">
        <div className="loading-spinner">🎯</div>
        <p>Loading assessment...</p>
      </div>
    </div>
  );
}

export default SkillsAssessment;