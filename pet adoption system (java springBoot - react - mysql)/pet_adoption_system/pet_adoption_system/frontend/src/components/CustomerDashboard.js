import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import Navbar from "./Navbar";

const CustomerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleCardClick = (type) => {
    navigate(`/customer/${type}`);
  };
  
  return (
    <div className="dashboard-container">
      <Navbar />
      <h2>Welcome, {user.username} 🐾</h2>
      <div className="pet-grid">
      
        {['dogs', 'cats', 'fish', 'hamsters'].map((type) => (
          <div
            key={type}
            className="pet-card"
            onClick={() => handleCardClick(type)}
          >
            <div className="pet-card-header">
              <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
