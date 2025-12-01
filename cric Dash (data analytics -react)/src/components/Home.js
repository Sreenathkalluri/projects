import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import cskImage from "./CSK.png";
import srhImage from "./SRH.jpg";
import miImage from "./MI.png";
import kkrImage from "./KKR.png";
import dcImage from "./DC.png";
import rrImage from "./RR.png";
import rcbImage from "./RCB.png";
import { Home as HomeIcon, Calendar, BarChart, Info } from "lucide-react";

const teams = {
  CSK: { image: cskImage, primaryColor: "#FFC72C" },
  SRH: { image: srhImage, primaryColor: "#FF4500" },
  MI: { image: miImage, primaryColor: "#045093" },
  KKR: { image: kkrImage, primaryColor: "#3A225D" },
  DC: { image: dcImage, primaryColor: "#17449B" },
  RR: { image: rrImage, primaryColor: "#EA1A80" },
  RCB: { image: rcbImage, primaryColor: "#DA1818" },
};

const teamKeys = Object.keys(teams);

const Home = () => {
  const [teamIndex, setTeamIndex] = useState(0);
  const [fade, setFade] = useState("fade-in");

  useEffect(() => {
    const interval = setInterval(() => {
      setFade("fade-out");
      setTimeout(() => {
        setTeamIndex((prevIndex) => (prevIndex + 1) % teamKeys.length);
        setFade("fade-in");
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`home-container ${fade}`}
      style={{ backgroundImage: `url(${teams[teamKeys[teamIndex]].image})` }}
    >
      <div className="overlay"></div>

<div className="hero">
  <div className="hero-card">
    <h1 className="hero-title">CRIC DASH</h1>
    <p className="hero-subtitle">Your Ultimate Cricket Dashboard</p>
    <div className="hero-buttons">
      <Link to="/explore" className="btn">
        Explore Now
      </Link>
    </div>
  </div>
</div>


      {/* Fixed Bottom Navigation */}
      <nav className="bottom-nav">
  <Link to="/" className="nav-item">
    <HomeIcon size={24} />
    <span>Home</span>
  </Link>
  <Link to="/matches" className="nav-item"> {/* Updated Link */}
    <Calendar size={24} />
    <span>Matches</span>
  </Link>
  <Link to="/table" className="nav-item">
    <BarChart size={24} />
    <span>Stats Table</span>
  </Link>
  <Link to="/about" className="nav-item">
    <Info size={24} />
    <span>About</span>
  </Link>
</nav>

    </div>
  );
};

export default Home;
