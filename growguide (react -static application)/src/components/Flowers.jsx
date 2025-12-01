// Import React and other necessary modules
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import img1 from './1img1.jpg';
import img2 from './1img2.jpg';
import img3 from './1img3.jpg';
import img4 from './1img4.jpg';
import img5 from './1img5.jpg';
import img6 from './1img6.jpg';
import img7 from './1img7.jpg';
import img8 from './1img8.jpg';
import img9 from './1img9.jpg';
import img10 from './1img10.jpg';
import img11 from './2img1.jpg';
import img12 from './2img2.jpg';
import img13 from './2img3.jpg';
import img14 from './2img4.jpg';
import img15 from './2img5.jpg';
import img16 from './2img6.jpg';
import img17 from './2img7.jpg';
import img18 from './2img8.jpg';
import img19 from './2img9.jpg';
import img20 from './2img10.jpg';
import img21 from './3img1.jpg';
import img22 from './3img2.jpg';
import img23 from './3img3.jpg';
import img24 from './3img4.jpg';
import img25 from './3img5.jpg';
import img26 from './3img6.jpg';
import img27 from './3img7.jpg';
import img28 from './3img8.jpg';
import img29 from './3img9.jpg';
import img30 from './3img10.jpg';
import './flowers.css';

// Define mapping of plant names to image paths
const plantImages = {
  "Orchid": img1,
  "Rose": img2,
  "Tulip": img3,
  "Hydrangea": img4,
  "Daffodil": img5,
  "Lily": img6,
  "Peony": img7,
  "Carnation": img8,
  "Sunflower": img9,
  "Petunia": img10,
  "Snake Plant": img11,
  "ZZ Plant": img12,
  "Pothos": img13,
  "Philodendron": img14,
  "Spider Plant": img15,
  "Peace Lily": img16,
  "Calathea": img17,
  "Fiddle Leaf Fig": img18,
  "Rubber Plant": img19,
  "Chinese Money Plant": img20,
  "Echeveria": img21,
  "Aloe Vera (Aloe barbadensis miller)": img22,
  "Jade Plant (Crassula ovata)": img23,
  "String of Pearls (Senecio rowleyanus)": img24,
  "Zebra Haworthia (Haworthia fasciata)": img25,
  "Christmas Cactus (Schlumbergera)": img26,
  "Barrel Cactus (Echinocactus grusonii)": img27,
  "Panda Plant (Kalanchoe tomentosa)": img28,
  "Burro's Tail (Sedum morganianum)": img29,
  "Euphorbia trigona (African Milk Tree)": img30
};

// FlowerCard component
const FlowerCard = ({ plant, handleFilter }) => {
  // Get the image path from the plantImages mapping
  const imagePath = plantImages[plant['Plant Name']];

  return (
    <div className="col-md-4 mb-3">
      <div className="plant-card" onClick={() => handleFilter([plant['Plant Type']])}>
        <div className="plant-image-container">
          <img src={imagePath} className="plant-image" alt={plant['Plant Name']} />
        </div>
        <div className="plant-content">
          <h5 className="plant-name">{plant['Plant Name']}</h5>
          <p className="plant-type">Type: {plant['Plant Type']}</p>
          <p className="plant-description"><b>Description:</b> {plant['Plant Description']}</p>
          <div className="care-requirements">
            <h6>Care Requirements:</h6>
            <ul>
              <li>Light: {plant['Care Requirements']['Light']}</li>
              <li>Watering: {plant['Care Requirements']['Watering']}</li>
              <li>Soil: {plant['Care Requirements']['Soil']}</li>
              <li>Temperature: {plant['Care Requirements']['Temperature']}</li>
              <li>Humidity: {plant['Care Requirements']['Humidity']}</li>
              <li>Fertilization: {plant['Care Requirements']['Fertilization']}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Flowers component
const Flowers = () => {
  const [queryParameters] = useSearchParams();
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showOnlyFlowering, setShowOnlyFlowering] = useState(false);

  const handleFilter = (plantType) => {
    const selectedPlantTypes = Array.isArray(plantType) ? plantType : [plantType];
    const filtered = plants.filter(plant => selectedPlantTypes.includes(plant['Plant Type']));

     const finalFiltered  = filtered.filter(plant =>
       (plant['Plant Type'] && plant['Plant Type'].toLowerCase().includes(searchTerm)) ||
       (plant['Plant Name'] && plant['Plant Name'].toLowerCase().includes(searchTerm))
     );

    setFilteredData(filtered);
  };

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch(`http://localhost:8080/flowers?flower_category=${queryParameters.get('flower_category')}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPlants(data);
        console.log(queryParameters.get('flower_category'))
        // handleFilter(queryParameters);
      } catch (error) {
        console.error('Error fetching plant data:', error);
      }
    };
    fetchPlants();
  }, [queryParameters]);

  useEffect(() => {
    handleFilter(queryParameters.get('flower_category'))
  }, [plants]) 

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    
    const filtered = plants.filter(plant =>
      (plant['Plant Type'] && plant['Plant Type'].toLowerCase().includes(searchTerm)) ||
      (plant['Plant Name'] && plant['Plant Name'].toLowerCase().includes(searchTerm))
    );

    setFilteredData(filtered);
  };

  return (
    <div className="container-fluid">
      <div className="row text-center">
        <div className="col-md-4">
          <h2 className="text-dark mb-4">Search Plant</h2>
          <input type="text" className="form-control" placeholder="Enter plant category or name" onChange={handleSearch} />
        </div>
      </div>
      <div className="row mt-3">
        {filteredData.map((plant, index) => (
          (!showOnlyFlowering || plant['Plant Type'] === 'Flowering Plants') && (
            <FlowerCard key={index} plant={plant} handleFilter={handleFilter} />
          )
        ))}
      </div>
    </div>
  );
};

export default Flowers;
