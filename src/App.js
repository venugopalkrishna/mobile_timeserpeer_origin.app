import React, { useState,  } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout from "../src/Components/DashboardLayout";
import Dashboard from "../src/Components/Pages/Dashboard";
import Settings from "../src/Components/Pages/Settings";
import Profile from "../src/Components/Pages/Profile";
import Estimation from "./Components/POSReports/Estimation";
import EstimationDetails from "./Components/POSReports/EstimatiomRegister/EstimationDetails";
import EstimationSummary from "./Components/POSReports/EstimatiomRegister/EstimationSummary";
import LoginPage from "./Components/Masters/Logins/LoginPage";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true"); // Store login status
    setIsAuthenticated(true);
  };

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/estimations" element={<Estimation />} />
                  <Route path="/estimation-details" element={<EstimationDetails />} />
                  <Route path="/estimation-summary" element={<EstimationSummary />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
