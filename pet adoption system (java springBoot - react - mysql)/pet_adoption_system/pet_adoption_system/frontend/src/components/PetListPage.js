import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';

const PetListPage = () => {
  const { type } = useParams();
  const [pets, setPets] = useState([]);
  const [adoptedPetIds, setAdoptedPetIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [petsResponse, adoptionsResponse] = await Promise.all([
          fetch(`http://localhost:8081/api/${type}`),
          fetch(`http://localhost:8081/api/adoptions/${user.email}`)
        ]);

        const petsData = await petsResponse.json();
        const adoptionsData = await adoptionsResponse.json();

        const petsWithImageUrl = petsData.map(pet => ({
          ...pet,
          imageUrl: pet.image
        }));

        setPets(petsWithImageUrl);

        const adoptedIds = adoptionsData
          .filter(req => req.petType === type)
          .map(req => req.petId);

        setAdoptedPetIds(adoptedIds);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, user.email]);

  const handleAdoptClick = (petId) => {
    navigate(`/adopt/${type}/${petId}`);
  };

  const handleImageError = (e) => {
    if (!e.target.dataset.fallback) {
      e.target.src = 'https://sreenathkalluri.github.io/pets/no_image.jpg';
      e.target.dataset.fallback = 'true';
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <h2>Loading {type}...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Available for Adoption</h2>

      {pets.length === 0 ? (
        <div className="no-pets-message">
          <p>No {type} available currently.</p>
        </div>
      ) : (
        <div className="pet-grid">
          {pets.map((pet) => {
            const isAdopted = adoptedPetIds.includes(pet.id);
            const isAvailable = pet.available && !isAdopted;

            return (
              <div className="pet-card" key={pet.id}>
                <div className="pet-image-container">
                  {pet.imageUrl ? (
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="pet-image"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="pet-image-placeholder">
                      <span>No Image Available</span>
                    </div>
                  )}
                </div>

                <div className="pet-card-body">
                  <h3 className="pet-name">{pet.name}</h3>
                  <div className="pet-details">
                    <p><strong>Breed:</strong> {pet.breed}</p>
                    <p><strong>Age:</strong> {pet.age} years</p>
                    {pet.gender && <p><strong>Gender:</strong> {pet.gender}</p>}
                    {pet.vaccinationStatus !== undefined && (
                      <p><strong>Vaccinated:</strong> {pet.vaccinationStatus ? '✓' : '✗'}</p>
                    )}
                    {pet.adoptionFee && (
                      <p><strong>Fee:</strong> ${pet.adoptionFee}</p>
                    )}
                  </div>

                  {pet.description && (
                    <div className="pet-description">
                      <p>{pet.description}</p>
                    </div>
                  )}

                  {pet.traits && pet.traits.length > 0 && (
                    <div className="pet-traits">
                      {pet.traits.map((trait, index) => (
                        <span key={index} className="trait-badge">{trait}</span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleAdoptClick(pet.id)}
                    disabled={!isAvailable}
                    className={`adopt-button ${isAdopted ? 'adopted' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                  >
                    {isAdopted
                      ? "Adoption Requested"
                      : pet.available
                        ? "Adopt Now"
                        : "Not Available"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PetListPage;
