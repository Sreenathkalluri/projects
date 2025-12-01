import React, { useEffect, useState } from "react";
import "./Stadiums.css"; // optional CSS styling

const Stadiums = () => {
  const [stadiums, setStadiums] = useState([]);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await fetch("https://sreenathkalluri.github.io/AD3_2/Venue.json");
        const data = await response.json();
        setStadiums(data);
      } catch (error) {
        console.error("Error fetching stadium data:", error);
      }
    };

    fetchStadiums();
  }, []);

  return (
    <div className="stadium-container">
      <h2 className="stadium-title">IPL Stadiums</h2>
      <div className="stadium-grid">
        {stadiums.map((stadium, index) => (
          <div key={index} className="stadium-card">
            <img src={stadium.image_url} alt={stadium.name} className="stadium-image" />
            <h3>{stadium.name}</h3>
            <p><strong>Location:</strong> {stadium.location}</p>
            <p><strong>Capacity:</strong> {stadium.capacity}</p>
            <p><strong>Home Team:</strong> {stadium.home_team}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stadiums;
