import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import "./BestBowlingFigures.css";

const BestBowlingFigures = () => {
  const [bowlingData, setBowlingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://sreenathkalluri.github.io/AD3_2/best_bowling.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setBowlingData(data);
        } else {
          throw new Error("Fetched data is empty or invalid.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (bowlingData.length === 0) return <div className="error">No data available.</div>;

  // Pagination Logic
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentData = bowlingData.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(bowlingData.length / playersPerPage);

  return (
    <div className="bowling-table-container">
      <h1>Best Bowling Figures</h1>

      <table>
        <thead>
          <tr>
            <th>Bowler</th>
            <th>Wickets</th>
            <th>Runs Conceded</th>
            <th>Overs</th>
            <th>Strike Rate</th>
            <th>Opposing Team</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((player, index) => {
            const playerImage = `https://scores.iplt20.com/ipl/playerimages/${encodeURIComponent(player.bowler.trim())}.png?v=1`;
            const strikeRate = player.wickets > 0 ? (player.balls_bowled / player.wickets).toFixed(2) : "∞";

            return (
              <tr key={index}>
                <td className="player-cell">
                  <img 
                    src={playerImage} 
                    alt={player.bowler.trim()} 
                    className="player-image" 
                    onError={(e) => (e.target.src = "https://via.placeholder.com/70")} 
                  />
                  <span className="player-name">{player.bowler.trim()}</span>
                </td>
                <td>{player.wickets}</td>
                <td>{player.runs_conceded}</td>
                <td>{player.overs_bowled}</td>
                <td>{strikeRate}</td>
                <td>{player.opponent_team.trim()}</td>

              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default BestBowlingFigures;
