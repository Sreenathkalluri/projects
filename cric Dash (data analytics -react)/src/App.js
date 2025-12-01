import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Matches from "./components/Matches";
import PlayerCards from "./components/PlayerCards";
import PlayerTable from "./components/PlayerTable";
import PlayerDetails from "./components/PlayerDetails";
import Explore from "./components/Explore";
import HighestRunScorer from "./components/HighestRunScorer";
import BestBowlingFigures from "./components/BestBowlingFigures";
import Stadiums from "./components/Stadiums";
import StatsComparison from "./components/StatsComparison";
import About from "./components/About";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/players" element={<PlayerCards />} />
          <Route path="/table" element={<PlayerTable />} />
          <Route path="/player/:name" element={<PlayerDetails />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/highest-run-scorer" element={<HighestRunScorer />} />
          <Route path="/explore/best-bowling-figures" element={<BestBowlingFigures />} />
          <Route path="/explore/stadiums" element={<Stadiums />} />
          <Route path="/explore/stats-comparison" element={<StatsComparison />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
