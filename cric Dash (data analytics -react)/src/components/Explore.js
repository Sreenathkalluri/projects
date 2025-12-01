import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Globe, BarChart,  Target} from "lucide-react";
import "./Explore.css";

const exploreOptions = [
  { path: "/explore/highest-run-scorer", title: "Highest Run Scorer", icon: <TrendingUp /> },
  { path: "/explore/best-bowling-figures", title: "Best Bowling Figures", icon: <Target /> },
  { path: "/explore/stadiums", title: "Stadium Stats", icon: <Globe /> },
  { path: "/explore/stats-comparison", title: "Stats Comparison", icon: <BarChart /> },
];

const Explore = () => {
  return (
    <div className="explore-container">
      <h1 className="explore-title">Explore Cricket Stats</h1>
      <div className="explore-grid">
        {exploreOptions.map((item, index) => (
          <Link to={item.path} key={index} className="explore-card">
            <div className="explore-icon">{item.icon}</div>
            <h3 className="explore-text">{item.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Explore;
