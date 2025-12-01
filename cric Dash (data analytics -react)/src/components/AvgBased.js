import React, { useEffect, useState } from "react";

const AvgBased = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      // Example data (Replace with API call if needed)
      const data = [
        { player: "MS Dhoni", avg: 42.5 },
        { player: "Virat Kohli", avg: 38.6 },
      ];
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      <h2>Players Based on Batting Average</h2>
      <ul>
        {players.map((item, index) => (
          <li key={index}>
            {item.player} - Avg: {item.avg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvgBased;
