import React, { useEffect, useState } from "react";

const StrikeRateBased = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      // Example data (Replace with API call if needed)
      const data = [
        { player: "AB de Villiers", sr: 152.3 },
        { player: "Chris Gayle", sr: 148.9 },
      ];
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      <h2>Players Based on Strike Rate</h2>
      <ul>
        {players.map((item, index) => (
          <li key={index}>
            {item.player} - Strike Rate: {item.sr}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StrikeRateBased;
