import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PlayerDetails.css";

const PlayerDetails = () => {
  const { name } = useParams();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    fetch("https://sreenathkalluri.github.io/AD3_2/all_batsmen%20(1).json")
      .then((res) => res.json())
      .then((data) => setPlayer(data.find((p) => p.Name === name)))
      .catch((err) => console.error("Error fetching data:", err));
  }, [name]);

  if (!player) return <div className="loading">Loading Player Stats...</div>;

  return (
    <div className="player-details">
      <h1>{player.Name}</h1>
      <img
        src={player.ImageURL} // Directly using the image URL from JSON
        alt={player.Name}
        className="player-image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150"; // Fallback image
        }}
      />
      <table>
        <tbody>
          <tr>
            <td>Team</td>
            <td>{player.Team}</td>
          </tr>
          <tr>
            <td>Runs</td>
            <td>{player.RunsScored}</td>
          </tr>
          <tr>
            <td>Innings</td>
            <td>{player.InningsBatted}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td>{player.BattingAVG}</td>
          </tr>
          <tr>
            <td>Strike Rate</td>
            <td>{player["BattingS/R"]}</td>
          </tr>
          <tr>
            <td>4s</td>
            <td>{player["4s"]}</td>
          </tr>
          <tr>
            <td>6s</td>
            <td>{player["6s"]}</td>
          </tr>
          <tr>
            <td>Teams Played</td>
            <td>{player.Teams_Played}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PlayerDetails;
