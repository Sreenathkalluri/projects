import React, { useEffect, useState } from "react";

const HighestRunsSeason = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      // Example data (Replace with API call if needed)
      const data = [
        { player: "Virat Kohli", season: 2016, runs: 973 },
        { player: "David Warner", season: 2016, runs: 848 },
      ];
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      <h2>Highest Runs in a Season</h2>
      <ul>
        {players.map((item, index) => (
          <li key={index}>
            {item.player} - {item.runs} runs in {item.season}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighestRunsSeason;
