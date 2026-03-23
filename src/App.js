import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "../src/Components/DashboardLayout";
import Dashboard from "../src/Components/Pages/Dashboard";
import Settings from "../src/Components/Pages/Settings";
import Profile from "../src/Components/Pages/Profile";
import Estimation from "./Components/POSReports/Estimation";
import EstimationDetails from "./Components/POSReports/EstimatiomRegister/EstimationDetails";
import EstimationSummary from "./Components/POSReports/EstimatiomRegister/EstimationSummary";
import LoginPage from "./Components/Masters/Logins/LoginPage";
import ReturnEstimation from "./Components/ReturnEstimation/ReturnEstimation";
import ReturnEstimationDetails from "./Components/ReturnEstimation/ReturnEstimationDetails";
import ReturnEstimationSummary from "./Components/ReturnEstimation/ReturnEstimationSummary";
import TagDetails from "./Components/Inventory/TagDetails";
import SlipSummary from "./Components/Inventory/SlipSummary";
import TagStockSummary from "./Components/Inventory/TagStockSummary";
import TagCheck from "./Components/Inventory/TagCheck";
import SaleEstimation from "./Components/Sale/SaleEstimation";
import SaleReturnEstimation from "./Components/SaleReturn/SaleReturnEstimation";
import Voucher from "./Components/SmithTransaction/Voucher";
import CustomerDetails from "./Components/Masters/CustomerDetails/CustomerDetails";
const App = () => {
  const tenantName = localStorage.getItem("tenantName");
  const [isAuthenticated, setIsAuthenticated] = useState(
    // localStorage.getItem("isLoggedIn") === "true"
    tenantName,
  );

  const handleLogin = (name) => {
    // localStorage.setItem("isLoggedIn", "true"); // Store login status
    setIsAuthenticated(name);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/estimations-model1" element={<Estimation />} />
                <Route path="/estimations-model2" element={<Estimation />} />
                <Route
                  path="/estimation-details"
                  element={<EstimationDetails />}
                />
                <Route
                  path="/estimation-summary"
                  element={<EstimationSummary />}
                />
                <Route
                  path="/return-estimations-model1"
                  element={<ReturnEstimation />}
                />
                <Route
                  path="/return-estimations-model2"
                  element={<ReturnEstimation />}
                />
                <Route
                  path="/return-estimation-details"
                  element={<ReturnEstimationDetails />}
                />
                <Route
                  path="/return-estimation-summary"
                  element={<ReturnEstimationSummary />}
                />
                <Route path="/tag-details" element={<TagDetails />} />
                <Route path="/slip-summary" element={<SlipSummary />} />
                <Route
                  path="/tag-stock-summary"
                  element={<TagStockSummary />}
                />
                <Route path="/tag-check" element={<TagCheck />} />
                <Route path="/sale" element={<SaleEstimation />} />
                <Route path="/sale-return" element={<SaleReturnEstimation />} />
                <Route path="/voucher" element={<Voucher />} />
                <Route path="/customer" element={<CustomerDetails />} />
              </Routes>
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
