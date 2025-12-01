import React, { useEffect, useState } from "react";

const HighestWicketsSeason = () => {
  const [bowlers, setBowlers] = useState([]);

  useEffect(() => {
    const fetchBowlers = async () => {
      // Example data (Replace with API call if needed)
      const data = [
        { bowler: "Dwayne Bravo", season: 2013, wickets: 32 },
        { bowler: "Harshal Patel", season: 2021, wickets: 32 },
      ];
      setBowlers(data);
    };

    fetchBowlers();
  }, []);

  return (
    <div>
      <h2>Highest Wickets in a Season</h2>
      <ul>
        {bowlers.map((item, index) => (
          <li key={index}>
            {item.bowler} - {item.wickets} wickets in {item.season}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighestWicketsSeason;
