import React, { useState } from 'react';
import './styles.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // default role

  const handleSignup = () => {
    fetch("http://localhost:8081/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, gmail, password, role })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Signed up:", data);
        alert(`Signup successful as ${data.role}`);
      })
      .catch(err => {
        console.error("Signup error:", err);
        alert("Signup failed!");
      });
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Gmail"
        value={gmail}
        onChange={e => setGmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="petManager">Pet Manager</option>
      </select>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
