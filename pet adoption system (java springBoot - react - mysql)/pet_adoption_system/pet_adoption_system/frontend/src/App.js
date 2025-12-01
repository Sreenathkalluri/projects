import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CustomerDashboard from "./components/CustomerDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import PetListPage from "./components/PetListPage";
import AdoptionForm from "./components/AdoptionForm"; 
import './components/styles.css';
import PaymentPage from "./components/PaymentPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/:type" element={<PetListPage />} />
        <Route path="/adopt/:type/:id" element={<AdoptionForm />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/payment/:id" element={<PaymentPage />} />

      </Routes>
    </Router>
  );
}

export default App;
