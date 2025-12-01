import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import "./PlayerTable.css";
import batIcon from "./bat-icon.png"; 
import ballIcon from "./ball-icon.png"; 

const PlayerTable = () => {
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBowlingStats, setIsBowlingStats] = useState(false);
  const playersPerPage = 20;

  // Function to clean and format team names
  const formatTeams = (teams) => {
    if (!teams) return "N/A";
    teams = teams.replace(/Royal Challengers Bengaluru/g, "Royal Challengers Bangalore");
    return [...new Set(teams.split(",").map((team) => team.trim()))].join(", ");
  };

  // Function to fetch player data based on selected mode (Batting/Bowling)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const url = isBowlingStats
        ? "https://sreenathkalluri.github.io/AD3_2/all_bowling.json"
        : "https://sreenathkalluri.github.io/AD3_2/all_batsmen%20(1).json";

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPlayerData(data);
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
  }, [isBowlingStats]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (playerData.length === 0) return <div className="error">No data available.</div>;

  // Pagination Logic
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentData = playerData.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(playerData.length / playersPerPage);

  return (
    <div className="player-table-container">
      <h1>{isBowlingStats ? "Bowling Stats" : "Batting Stats"}</h1>

      {/* Toggle Button for Batting/Bowling Stats */}
      <div className="toggle-container">
        <span className={`toggle-label ${!isBowlingStats ? "highlight" : "dim"}`}>Batting</span>

        <label className="switch">
          <input 
            type="checkbox" 
            checked={isBowlingStats} 
            onChange={() => setIsBowlingStats(!isBowlingStats)} 
          />
          <span className="slider round">
            <img 
              src={isBowlingStats ? ballIcon : batIcon} 
              alt={isBowlingStats ? "Bowling" : "Batting"} 
              className="slider-icon"
            />
          </span>
        </label>

        <span className={`toggle-label ${isBowlingStats ? "highlight" : "dim"}`}>Bowling</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            {isBowlingStats ? (
              <>
                <th>Wickets</th>
                <th>Balls Bowled</th>
                <th>Overs</th>
                <th>Runs Conceded</th>
                <th>Economy</th>
                <th>Avg</th>
                <th>Strike Rate</th>
              </>
            ) : (
              <>
                <th>Runs</th>
                <th>Balls Faced</th>
                <th>Avg</th>
                <th>Strike Rate</th>
                <th>4s</th>
                <th>6s</th>
                <th>Teams</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {currentData.map((player, index) => {
            const playerName = isBowlingStats ? player.bowler : player.name;
            const playerImage = `https://scores.iplt20.com/ipl/playerimages/${encodeURIComponent(playerName)}.png?v=1`;

            return (
              <tr key={index} className="hover-slider">
                <td className="player-cell">
                  <img 
                    src={playerImage} 
                    alt={playerName} 
                    className="player-image" 
                    onError={(e) => (e.target.src = "https://via.placeholder.com/50")} 
                  />
                  <span className="player-name">{playerName}</span>
                </td>
                {isBowlingStats ? (
                  <>
                    <td>{player.total_wickets}</td>
                    <td>{player.balls_bowled}</td>
                    <td>{player.overs_bowled}</td>
                    <td>{player.runs_conceded}</td>
                    <td>{player.economy_rate}</td>
                    <td>{player.bowling_avg}</td>
                    <td>{player.bowling_strike_rate}</td>
                  </>
                ) : (
                  <>
                    <td>{player.total_runs}</td>
                    <td>{player.balls_faced}</td>
                    <td>{player.batting_avg}</td>
                    <td>{player.strike_rate}</td>
                    <td>{player.fours}</td>
                    <td>{player.sixes}</td>
                    <td className="team-cell">{formatTeams(player.teams_played)}</td>
                  </>
                )}
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

export default PlayerTable;