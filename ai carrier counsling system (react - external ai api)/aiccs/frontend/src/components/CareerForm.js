import React, { useState, useEffect } from "react";

function CareerForm({ onSubmit, loading, initialData }) {
  const [formData, setFormData] = useState({
    interests: "",
    strengths: "",
    goals: "",
    education: "",
    experience: "",
    workStyle: "",
    location: "",
    salary: "",
    note: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Define all options arrays
  const interestOptions = [
    { value: "Technology and Coding", label: "💻 Technology & Coding", category: "Tech" },
    { value: "Artificial Intelligence", label: "🤖 Artificial Intelligence & Machine Learning", category: "Tech" },
    { value: "Data Science", label: "📊 Data Science & Analytics", category: "Tech" },
    { value: "Cybersecurity", label: "🔒 Cybersecurity & Information Security", category: "Tech" },
    { value: "Web Development", label: "🌐 Web Development & Design", category: "Tech" },
    { value: "Mobile Development", label: "📱 Mobile App Development", category: "Tech" },
    { value: "Cloud Computing", label: "☁️ Cloud Computing & DevOps", category: "Tech" },
    { value: "Game Development", label: "🎮 Game Development & Design", category: "Tech" },
    { value: "Business and Management", label: "💼 Business & Management", category: "Business" },
    { value: "Entrepreneurship", label: "🚀 Entrepreneurship & Startups", category: "Business" },
    { value: "Finance and Banking", label: "💰 Finance & Banking", category: "Business" },
    { value: "Marketing and Sales", label: "📈 Marketing & Sales", category: "Business" },
    { value: "Human Resources", label: "👥 Human Resources & Talent Management", category: "Business" },
    { value: "Project Management", label: "📋 Project Management", category: "Business" },
    { value: "Healthcare and Medicine", label: "🏥 Healthcare & Medicine", category: "Healthcare" },
    { value: "Nursing", label: "💊 Nursing & Patient Care", category: "Healthcare" },
    { value: "Medical Research", label: "🔬 Medical Research & Biotechnology", category: "Healthcare" },
    { value: "Psychology", label: "🧠 Psychology & Mental Health", category: "Healthcare" },
    { value: "Science and Research", label: "🔭 Science & Research", category: "Science" },
    { value: "Engineering", label: "⚙️ Engineering (Various Fields)", category: "Science" },
    { value: "Environmental Science", label: "🌍 Environmental Science & Sustainability", category: "Science" },
    { value: "Physics and Astronomy", label: "🌌 Physics & Astronomy", category: "Science" },
    { value: "Chemistry", label: "🧪 Chemistry & Chemical Engineering", category: "Science" },
    { value: "Arts and Creativity", label: "🎨 Arts & Creative Fields", category: "Creative" },
    { value: "Graphic Design", label: "🎨 Graphic Design & Visual Arts", category: "Creative" },
    { value: "Writing and Journalism", label: "✍️ Writing & Journalism", category: "Creative" },
    { value: "Music and Performing Arts", label: "🎭 Music & Performing Arts", category: "Creative" },
    { value: "Film and Media", label: "🎬 Film, TV & Media Production", category: "Creative" },
    { value: "Education and Teaching", label: "👨‍🏫 Education & Teaching", category: "Education" },
    { value: "Social Work", label: "🤝 Social Work & Community Service", category: "Education" },
    { value: "Law and Legal Services", label: "⚖️ Law & Legal Services", category: "Professional" },
    { value: "Architecture", label: "🏛️ Architecture & Urban Planning", category: "Professional" },
    { value: "Real Estate", label: "🏠 Real Estate & Property Management", category: "Professional" },
    { value: "Hospitality and Tourism", label: "🏨 Hospitality & Tourism", category: "Service" },
    { value: "Culinary Arts", label: "👨‍🍳 Culinary Arts & Food Services", category: "Service" },
    { value: "Sports and Fitness", label: "⚽ Sports & Fitness", category: "Service" },
  ];

  const strengthOptions = [
    { value: "Problem Solving", label: "🔍 Analytical Problem Solving", category: "Analytical" },
    { value: "Critical Thinking", label: "💭 Critical Thinking & Analysis", category: "Analytical" },
    { value: "Creativity", label: "🎨 Creativity & Innovation", category: "Creative" },
    { value: "Leadership", label: "👑 Leadership & Management", category: "Social" },
    { value: "Communication", label: "💬 Verbal & Written Communication", category: "Social" },
    { value: "Teamwork", label: "🤝 Teamwork & Collaboration", category: "Social" },
    { value: "Adaptability", label: "🔄 Adaptability & Flexibility", category: "Personal" },
    { value: "Time Management", label: "⏰ Time Management & Organization", category: "Personal" },
    { value: "Technical Skills", label: "⚙️ Technical & Digital Skills", category: "Technical" },
    { value: "Mathematical Skills", label: "📐 Mathematical & Quantitative Skills", category: "Technical" },
    { value: "Research Skills", label: "🔬 Research & Investigation", category: "Analytical" },
    { value: "Strategic Planning", label: "🗺️ Strategic Planning & Vision", category: "Analytical" },
    { value: "Public Speaking", label: "🎤 Public Speaking & Presentation", category: "Social" },
    { value: "Negotiation", label: "🤝 Negotiation & Persuasion", category: "Social" },
    { value: "Empathy", label: "❤️ Empathy & Emotional Intelligence", category: "Personal" },
    { value: "Attention to Detail", label: "🔎 Attention to Detail & Precision", category: "Personal" },
    { value: "Multitasking", label: "🔄 Multitasking & Prioritization", category: "Personal" },
    { value: "Decision Making", label: "✅ Decision Making & Judgment", category: "Analytical" },
    { value: "Customer Service", label: "😊 Customer Service & Support", category: "Social" },
    { value: "Teaching and Mentoring", label: "👨‍🏫 Teaching & Mentoring", category: "Social" },
    { value: "Sales and Marketing", label: "📈 Sales & Marketing", category: "Social" },
    { value: "Programming", label: "💻 Programming & Coding", category: "Technical" },
    { value: "Data Analysis", label: "📊 Data Analysis & Statistics", category: "Technical" },
    { value: "Design Thinking", label: "🎨 Design Thinking & UX/UI", category: "Creative" },
    { value: "Project Management", label: "📋 Project Management", category: "Management" },
    { value: "Budget Management", label: "💰 Budget & Financial Management", category: "Management" },
  ];

  const educationOptions = [
    { value: "No Formal Education", label: "❌ No Formal Education" },
    { value: "High School Diploma", label: "🏫 High School Diploma" },
    { value: "Some College", label: "📚 Some College (No Degree)" },
    { value: "Associate Degree", label: "🎓 Associate Degree (2-year)" },
    { value: "Bachelor's Degree", label: "🎓 Bachelor's Degree (4-year)" },
    { value: "Master's Degree", label: "🎓 Master's Degree" },
    { value: "PhD/Doctorate", label: "🎓 PhD/Doctorate" },
    { value: "Professional Certification", label: "📜 Professional Certification" },
    { value: "Vocational Training", label: "🔧 Vocational/Trade School" },
    { value: "Bootcamp", label: "⚡ Coding Bootcamp" },
    { value: "Online Courses", label: "💻 Online Courses & Self-Study" },
    { value: "Currently in High School", label: "📖 Currently in High School" },
    { value: "Currently in College", label: "📖 Currently in College" },
    { value: "Currently in Graduate School", label: "📖 Currently in Graduate School" },
  ];

  const experienceOptions = [
    { value: "No experience", label: "🆕 No professional experience" },
    { value: "0-1 years", label: "🌱 0-1 years (Entry Level)" },
    { value: "1-3 years", label: "📈 1-3 years (Junior Level)" },
    { value: "3-5 years", label: "💼 3-5 years (Mid Level)" },
    { value: "5-8 years", label: "🚀 5-8 years (Senior Level)" },
    { value: "8-12 years", label: "👑 8-12 years (Expert Level)" },
    { value: "12+ years", label: "🎯 12+ years (Executive Level)" },
    { value: "Internship only", label: "🎓 Internship experience only" },
    { value: "Freelance experience", label: "💫 Freelance/Contract experience" },
    { value: "Career changer", label: "🔄 Career changer (different field)" },
  ];

  const goalOptions = [
    { value: "Entry-level position", label: "🚪 Entry-level position" },
    { value: "Career advancement", label: "📈 Career advancement/promotion" },
    { value: "Career change", label: "🔄 Complete career change" },
    { value: "Start business", label: "🚀 Start my own business" },
    { value: "Freelance work", label: "💫 Freelance/consulting work" },
    { value: "Remote work", label: "🏠 Remote work flexibility" },
    { value: "Higher salary", label: "💰 Higher salary/compensation" },
    { value: "Work-life balance", label: "⚖️ Better work-life balance" },
    { value: "Leadership role", label: "👑 Leadership/management role" },
    { value: "Technical expertise", label: "⚙️ Technical specialist role" },
    { value: "Creative fulfillment", label: "🎨 Creative fulfillment" },
    { value: "Social impact", label: "🤝 Social impact/work" },
    { value: "Education advancement", label: "🎓 Further education" },
    { value: "International work", label: "🌍 International work experience" },
    { value: "Government job", label: "🏛️ Government/public sector job" },
    { value: "Non-profit work", label: "❤️ Non-profit work" },
    { value: "Research position", label: "🔬 Research position" },
    { value: "Teaching position", label: "👨‍🏫 Teaching/education position" },
  ];

  const workStyleOptions = [
    { value: "Team collaboration", label: "👥 Team collaboration" },
    { value: "Independent work", label: "🔍 Independent work" },
    { value: "Remote work", label: "🏠 Remote work" },
    { value: "Office environment", label: "🏢 Office environment" },
    { value: "Flexible hours", label: "⏰ Flexible hours" },
    { value: "Structured schedule", label: "📅 Structured schedule" },
    { value: "Fast-paced", label: "⚡ Fast-paced environment" },
    { value: "Steady pace", label: "🐢 Steady, predictable pace" },
    { value: "Creative freedom", label: "🎨 Creative freedom" },
    { value: "Clear guidelines", label: "📋 Clear guidelines & processes" },
    { value: "Travel required", label: "✈️ Travel opportunities" },
    { value: "Local work", label: "📍 Local work only" },
  ];

  const locationOptions = [
    { value: "Any location", label: "🌍 Any location" },
    { value: "Major city", label: "🏙️ Major metropolitan area" },
    { value: "Suburban area", label: "🏡 Suburban area" },
    { value: "Rural area", label: "🌳 Rural area" },
    { value: "Remote only", label: "🏠 Remote work only" },
    { value: "Hybrid remote", label: "🔀 Hybrid remote/office" },
    { value: "Specific country", label: "🇺🇸 Specific country preference" },
    { value: "International", label: "✈️ Willing to relocate internationally" },
  ];

  const salaryOptions = [
    { value: "Entry level", label: "💰 $30K - $50K (Entry Level)" },
    { value: "Mid level", label: "💰 $50K - $80K (Mid Level)" },
    { value: "Senior level", label: "💰 $80K - $120K (Senior Level)" },
    { value: "Executive level", label: "💰 $120K+ (Executive Level)" },
    { value: "Commission based", label: "📊 Commission-based" },
    { value: "Hourly wage", label: "⏰ Hourly wage preferred" },
    { value: "Flexible", label: "💫 Flexible on compensation" },
  ];

  const groupOptions = (options) => {
    const grouped = {};
    options.forEach(option => {
      if (!grouped[option.category]) {
        grouped[option.category] = [];
      }
      grouped[option.category].push(option);
    });
    return grouped;
  };

  const groupedInterests = groupOptions(interestOptions);
  const groupedStrengths = groupOptions(strengthOptions);

  return (
    <form onSubmit={handleSubmit} className="career-form">
      <div className="form-section">
        <h3>📊 Your Career Profile</h3>
        
        {/* Primary Interests */}
        <div className="form-group">
          <label>🎯 Primary Interests:</label>
          <select name="interests" value={formData.interests} onChange={handleChange} required>
            <option value="">-- Select Your Main Interest Area --</option>
            {Object.entries(groupedInterests).map(([category, options]) => (
              <optgroup key={category} label={`📂 ${category}`}>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Key Strengths */}
        <div className="form-group">
          <label>💪 Your Key Strengths:</label>
          <select name="strengths" value={formData.strengths} onChange={handleChange} required>
            <option value="">-- Select Your Top Strength --</option>
            {Object.entries(groupedStrengths).map(([category, options]) => (
              <optgroup key={category} label={`📂 ${category}`}>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Education Level */}
        <div className="form-group">
          <label>🎓 Education Level:</label>
          <select name="education" value={formData.education} onChange={handleChange} required>
            <option value="">-- Select Highest Education --</option>
            {educationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Work Experience */}
        <div className="form-group">
          <label>💼 Work Experience:</label>
          <select name="experience" value={formData.experience} onChange={handleChange} required>
            <option value="">-- Select Experience Level --</option>
            {experienceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Career Goals */}
        <div className="form-group">
          <label>🎯 Future Career Goals:</label>
          <select name="goals" value={formData.goals} onChange={handleChange} required>
            <option value="">-- Select Your Main Goal --</option>
            {goalOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Work Style Preference */}
        <div className="form-group">
          <label>👥 Preferred Work Style:</label>
          <select name="workStyle" value={formData.workStyle} onChange={handleChange}>
            <option value="">-- Select Work Style Preference --</option>
            {workStyleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Preference */}
        <div className="form-group">
          <label>📍 Location Preference:</label>
          <select name="location" value={formData.location} onChange={handleChange}>
            <option value="">-- Select Location Preference --</option>
            {locationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Expectations */}
        <div className="form-group">
          <label>💰 Salary Expectations:</label>
          <select name="salary" value={formData.salary} onChange={handleChange}>
            <option value="">-- Select Salary Range --</option>
            {salaryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Information */}
        <div className="form-group">
          <label>📝 Additional Information:</label>
          <textarea
            name="note"
            placeholder="Tell us more about your specific interests, any constraints, preferred work environment, location preferences, skills you want to develop, industries you're curious about, or anything else that might help us provide better recommendations..."
            value={formData.note}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "🔄 Generating Your Career Plan..." : "🚀 Get Personalized Career Recommendations"}
        </button>
      </div>
    </form>
  );
}

export default CareerForm;