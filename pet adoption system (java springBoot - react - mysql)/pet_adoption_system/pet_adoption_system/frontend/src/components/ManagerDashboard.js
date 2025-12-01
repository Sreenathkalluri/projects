import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";

const petTypes = ["dogs", "cats", "fish", "hamsters"];

const ManagerDashboard = () => {
  const [pets, setPets] = useState({});
  const [adoptions, setAdoptions] = useState([]);
  const [newPet, setNewPet] = useState({
    type: "dogs",
    name: "",
    breed: "",
    age: "",
    image: ""
  });
  const [view, setView] = useState(null); // 'add', 'manage', 'adoptions'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petsData = {};
        for (const type of petTypes) {
          const response = await fetch(`http://localhost:8081/api/${type}`);
          petsData[type] = await response.json();
        }
        setPets(petsData);

        const adoptionsResponse = await fetch("http://localhost:8081/api/adoptions");
        setAdoptions(await adoptionsResponse.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (type, id, field, value) => {
    try {
      const updatedPets = { ...pets };
      const petIndex = updatedPets[type].findIndex(pet => pet.id === id);
      if (petIndex !== -1) {
        updatedPets[type][petIndex][field] = value;
        setPets(updatedPets);

        await fetch(`http://localhost:8081/api/${type}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPets[type][petIndex])
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await fetch(`http://localhost:8081/api/${type}/${id}`, {
        method: "DELETE"
      });
      setPets(prev => ({
        ...prev,
        [type]: prev[type].filter(pet => pet.id !== id)
      }));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleAddPet = async () => {
    const { type, name, breed, age, image } = newPet;
  
    if (!name || !image) {
      alert("Name and image are required!");
      return;
    }
  
    try {
      // Step 1: Fetch existing pets of that type to get max ID
      const petsResponse = await fetch(`http://localhost:8081/api/${type}`);
      if (!petsResponse.ok) throw new Error("Failed to fetch pets");
  
      const existingPets = await petsResponse.json();
      const maxId =
        existingPets.length > 0
          ? Math.max(...existingPets.map(pet => pet.id))
          : 0;
      const nextId = maxId + 1;
  
      // Step 2: Send POST request with manually assigned next ID
      const response = await fetch(`http://localhost:8081/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: nextId,
          name,
          breed,
          age: parseInt(age) || 0,
          image,
          available: true
        })
      });
  
      if (!response.ok) {
        throw new Error("Failed to add pet");
      }
  
      const savedPet = await response.json();
  
      setPets(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), savedPet]
      }));
  
      setNewPet({
        type: "dogs",
        name: "",
        breed: "",
        age: "",
        image: ""
      });
  
      setView(null);
    } catch (error) {
      console.error("Add failed:", error);
      alert("Error adding pet!");
    }
  };
  
  const handleAcceptRequest = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/adoptions/accept/${id}`, {
        method: "POST"
      });
      setAdoptions(prev =>
        prev.map(req => req.request_id === id ? { ...req, status: "Accepted" } : req)
      );
    } catch (error) {
      console.error("Accept request failed:", error);
    }
  };

  const handleDeleteAdoption = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/adoptions/${id}`, {
        method: "DELETE"
      });
      setAdoptions(prev => prev.filter(req => req.request_id !== id));
    } catch (error) {
      console.error("Delete adoption failed:", error);
    }
  };

  return (
    <div>
      <h2>Pet Manager Dashboard</h2>
      <Navbar />

      {!view && (
        <div className="dashboard-cards">
          <button className="card-button" onClick={() => setView("add")}>Add New Pet</button>
          <button className="card-button" onClick={() => setView("manage")}>Manage Pets</button>
          <button className="card-button" onClick={() => setView("adoptions")}>View Adoption Requests</button>
        </div>
      )}

      {view === "add" && (
        <div>
          <h3>Add New Pet</h3>
          <select
            value={newPet.type}
            onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
          >
            {petTypes.map(type => (
              <option key={type} value={type}>{type.toUpperCase()}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Name"
            value={newPet.name}
            onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Breed"
            value={newPet.breed}
            onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            value={newPet.age}
            onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newPet.image}
            onChange={(e) => setNewPet({ ...newPet, image: e.target.value })}
          />
          <button onClick={handleAddPet}>Add Pet</button>
        </div>
      )}

      {view === "manage" && (
        <div>
          <h3>Manage Pets</h3>
          {petTypes.map(type => (
            <div key={type}>
              <h4>{type.toUpperCase()}</h4>
              {(pets[type] || []).map(pet => (
                <div key={pet.id}>
                  <input
                    type="text"
                    value={pet.name}
                    onChange={(e) => handleUpdate(type, pet.id, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    value={pet.breed}
                    onChange={(e) => handleUpdate(type, pet.id, "breed", e.target.value)}
                  />
                  <input
                    type="number"
                    value={pet.age}
                    onChange={(e) => handleUpdate(type, pet.id, "age", e.target.value)}
                  />
                  <button onClick={() => handleDelete(type, pet.id)}>Delete</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {view === "adoptions" && (
        <div>
          <h3>Adoption Requests</h3>
          {adoptions.map(req => (
            <div key={req.request_id}>
              <p>{req.customer_name} requested to adopt {req.petType} #{req.petId}</p>
              <p>Status: {req.status}</p>
              {req.status !== "Accepted" && (
                <button onClick={() => handleAcceptRequest(req.request_id)}>Accept</button>
              )}
              <button onClick={() => handleDeleteAdoption(req.request_id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
