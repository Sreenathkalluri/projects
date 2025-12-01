import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';

const AdoptionForm = () => {
  const { type, id } = useParams(); // petType and petId from URL
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const adoptionRequest = {
      petId: parseInt(id),
      petType: type,
      adopterName: name,
      email,
      mobile,
      address
    };

    fetch("http://localhost:8081/api/adopt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adoptionRequest)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit adoption request");
        return res.json();
      })
      .then(() => {
        alert("Adoption request submitted!");
        navigate(`/pets/${type}`);
      })
      .catch((err) => {
        console.error(err);
        alert("Error submitting adoption request.");
      });
  };

  return (
    <div className="form-container">
      <h2>Adoption Form for {type.slice(0, -1)} #{id}</h2>
      <form onSubmit={handleSubmit} className="adoption-form">
        <div>
          <label>Full Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mobile:</label>
          <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
        </div>
        <div>
          <label>Address:</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <button type="submit">Submit Adoption Request</button>
      </form>
    </div>
  );
};

export default AdoptionForm;
