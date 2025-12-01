import React, { useEffect, useState } from "react";
import Pagination from "./Pagination"; // Import Pagination Component
import "./HighestRunScore.css"; // Importing the CSS

const HighestRunScore = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 10; // Number of players per page

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://sreenathkalluri.github.io/AD3_2/highest_scores.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonData = await response.json();
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          setData(jsonData);
        } else {
          throw new Error("No valid data found.");
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
  if (data.length === 0) return <div className="error">No data available.</div>;

  // Pagination Logic
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentData = data.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(data.length / playersPerPage);

  return (
    <div className="highest-score-container">
      <h2 className="highest-score-title">🔥 Highest Individual Scores</h2>

      <table className="highest-score-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>Strike Rate</th>
            <th>Inning</th>
            <th>Against</th>
            <th>Match ID</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((player, index) => {
            const playerImage = `https://scores.iplt20.com/ipl/playerimages/${encodeURIComponent(player.batter)}.png?v=1`;

            return (
              <tr key={index} className="highest-score-row">
                <td className="player-cell">
                  <img
                    src={playerImage}
                    alt={player.batter}
                    className="player-image"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
                  />
                  <span className="player-name">{player.batter}</span>
                </td>
                <td>{player.batsman_runs}</td>
                <td>{player.balls_faced}</td>
                <td>{player.strike_rate.toFixed(2)}</td>
                <td>{player.inning}</td>
                <td>{player.opposite_team.trim()}</td>
                <td>{player.match_id}</td>
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

export default HighestRunScore;
