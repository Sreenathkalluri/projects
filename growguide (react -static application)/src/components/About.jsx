import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ColorThief from 'colorthief';
import img1 from './img1.jpg';
import img2 from './img2.jpg';
import img3 from './img3.jpg';
import img4 from './img4.jpg';
import img5 from './img5.jpg';
import img6 from './img6.jpg';
import img7 from './img7.jpg';
import img8 from './img8.jpg';

// Function to determine text color based on background color
const determineTextColor = (bgColor) => {
  const brightness = Math.round(((parseInt(bgColor.slice(1, 3), 16) * 299) +
    (parseInt(bgColor.slice(3, 5), 16) * 587) +
    (parseInt(bgColor.slice(5), 16) * 114)) / 1000);
  return brightness > 125 ? '#000000' : '#ffffff';
};

const PlantCard = ({ plant, image, bgColor }) => {
  const link = `/flowers?flower_category=${plant.Category}`;
  const textColor = determineTextColor(bgColor); // Function to determine text color based on background
  return (
    <div className="col-md-4 mb-3">
      <Link to={link} style={{ textDecoration: 'none' }}>
        <div className="plant-card" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="plant-image-container">
            <img src={image} className="plant-image" alt={plant['Category']} />
          </div>
          <div className="plant-content">
            <h5 className="plant-title">{plant['Category']}</h5>
            <p className="plant-description">{plant.Description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

const About = () => {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('http://localhost:8080/sample');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPlants(data);
        setFilteredData(data); // Set filtered data initially with all plants
      } catch (error) {
        console.error('Error fetching plant data:', error);
      }
    };
    fetchPlants();

    const backgroundImage = new Image();
    backgroundImage.crossOrigin = 'Anonymous';
    backgroundImage.src = '/backgroundImage.jpg'; // Replace with your background image path
    backgroundImage.onload = function () {
      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(backgroundImage);
      const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
      setBgColor(rgbColor);
    };
  }, []);

  const imagePaths = [img1, img2, img3, img4, img5, img6, img7, img8].slice(0, plants.length);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredData(plants.filter(plant =>
      plant['Category'] && plant['Category'].toLowerCase().includes(e.target.value.toLowerCase())
    ));
  };

  const handleFilter = (plantType) => {
    const selectedPlantTypes = Array.isArray(plantType) ? plantType : [plantType];
    setFilteredData(plants.filter(plant => selectedPlantTypes.includes(plant['Plant Type'])));
  };
  

  return (
    <div className="container-fluid">
      <div className="row text-center">
        <div className="col-md-4">
          <h2 className="text-dark mb-4">Search Plant</h2>
          <input type="text" className="form-control" placeholder="Enter plant category" onChange={handleSearch} />
        </div>
      </div>
      <div className="row mt-3">
        {filteredData.map((plant, index) => (
          <PlantCard key={index} plant={plant} image={imagePaths[index % imagePaths.length]} bgColor={bgColor} />
        ))}
      </div>
    </div>
  );
};

export default About;
