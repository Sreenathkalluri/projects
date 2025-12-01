import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Flowers from './components/Flowers';

import backgroundImage from './backgroundImage.jpg';
import logo from './components/logo.png'; // Import your logo image
import './App.css'; // Import the stylesheet

const App = () => {
  const [navBarColor, setNavBarColor] = useState('');

  const calculateAverageColor = (imageSrc) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0);
      const imageData = ctx.getImageData(0, 0, this.width, this.height).data;
      let r = 0,
        g = 0,
        b = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }
      r = Math.floor(r / (imageData.length / 4));
      g = Math.floor(g / (imageData.length / 4));
      b = Math.floor(b / (imageData.length / 4));
      const averageColor = `rgb(${r}, ${g}, ${b})`;
      setNavBarColor(averageColor);
    };
  };

  useEffect(() => {
    calculateAverageColor(backgroundImage);
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <Router>
      <div className="app">
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: navBarColor }}>
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="GrowGuide Logo" style={{ height: '40px', marginRight: '10px' }} />
              <span className="text-light">GrowGuide</span>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/about">Plants</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='container'>
          <Routes>
            <Route path="/Ad40" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/flowers" element={<Flowers />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
