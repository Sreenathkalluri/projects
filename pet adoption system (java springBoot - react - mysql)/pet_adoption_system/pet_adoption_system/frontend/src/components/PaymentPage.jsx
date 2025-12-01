// PaymentPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';

const PaymentPage = () => {
  const { id } = useParams(); // adoption request ID
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    // Mock payment handler
    alert("Payment successful!");
  };

  return (
    <div className="form-container">
      <h2>Payment for Request #{id}</h2>
      <form onSubmit={handlePayment} className="adoption-form">
        <div>
          <label>Card Number:</label>
          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
        </div>
        <div>
          <label>CVV:</label>
          <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
        </div>
        <div>
          <label>Expiry Date:</label>
          <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" required />
        </div>
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;