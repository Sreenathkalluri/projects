import React, { useState, useEffect } from "react";
import "./Matches.css";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2022"); // Default to latest season
  const years = Array.from({ length: 15 }, (_, i) => (2022 - i).toString()); // Generates ["2022", ..., "2008"]

  useEffect(() => {
    fetch("https://sreenathkalluri.github.io/AD3_2/match_details.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Debugging
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          console.error("Unexpected data format:", data);
        }
      })
      .catch((err) => console.error("Error fetching match data:", err));
  }, []);

  useEffect(() => {
    if (matches.length > 0) {
      console.log("First Match Object:", matches[0]);
    }
  }, [matches]);

  // Filter matches based on selected season
  const filteredMatches = matches.filter((match) => match.Season === selectedYear);

  return (
    <div className="matches-container">
      <h1>SCHEDULE ({selectedYear})</h1>

      {/* Year (Season) Dropdown */}
      <div className="year-selector">
        <label>Select Season: </label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Match Table */}
      {filteredMatches.length > 0 ? (
        <table className="matches-table">
          <thead>
            <tr>
              <th>Match No</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Team 1</th>
              <th>Team 2</th>
              <th>Winning Team</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.map((match, index) => (
              <tr key={index}>
                <td>{match.MatchNumber}</td>
                <td>{match.Date || "N/A"}</td>
                <td>{match.Venue || "N/A"}</td>
                <td>{match.Team1 || "N/A"}</td>
                <td>{match.Team2 || "N/A"}</td>
                <td className="winner">{match.WinningTeam || "TBD"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-matches">No matches found for {selectedYear}</p>
      )}
    </div>
  );
};

export default Matches;
