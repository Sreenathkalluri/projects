import React from 'react';
import './PlayerCards.css';

const PlayerCard = ({ player }) => {
  // Ensure player is defined before accessing its properties
  if (!player) {
    return <div className="player-card">No Player Data</div>;
  }

  return (
    <div className="player-card">
      <div className="player-image-container">
        <img 
          src={player.Url || "https://via.placeholder.com/100"} 
          alt={player.Name || "Player"} 
          className="player-image"
          onError={(e) => { e.target.src = "https://via.placeholder.com/100"; }} 
        />
      </div>
      <div className="player-details">
        <h3>{player.Name || "Unknown Player"}</h3>
        <p><strong>Team:</strong> {player.Team || "N/A"}</p>
        <p><strong>Runs:</strong> {player.RunsScored || 0}</p>
        <p><strong>Innings:</strong> {player.InningsBatted || 0}</p>
        <p><strong>Avg:</strong> {player.BattingAVG || "N/A"}</p>
        <p><strong>Strike Rate:</strong> {player["BattingS/R"] || "N/A"}</p>
        <p><strong>4s:</strong> {player["4s"] || 0}</p>
        <p><strong>6s:</strong> {player["6s"] || 0}</p>
        <p><strong>Teams Played:</strong> {player.Teams_Played || "N/A"}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
