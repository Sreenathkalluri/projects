import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:8081/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Invalid credentials");
        } else {
          setError(`Login failed with status ${response.status}`);
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "petManager") {
        navigate("/manager");
      } else if (data.role === "customer") {
        navigate("/customer");
      } else {
        setError("Unknown role: " + data.role);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <button 
            className="auth-button" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <button className="text-link" onClick={goToSignup}>
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;