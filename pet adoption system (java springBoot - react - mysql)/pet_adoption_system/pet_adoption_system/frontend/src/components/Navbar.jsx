// src/components/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        Pet Adoption System
      </div>

      <div className="navbar-right">
        {user?.role === "customer" }
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
