import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import SellerProfilePage from "./pages/SellerProfilePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MarketplacePage from "./pages/MarketplacePage";
import { loadSavedTheme } from "./styles/themes";
import "./styles.css";

function App() {
  useEffect(() => {
    loadSavedTheme();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Homepage - Beautiful Linktree-style landing page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Dashboard (requires login) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Marketplace - Browse all products */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          
          {/* Seller profile pages - MUST BE LAST */}
          <Route path="/:username" element={<SellerProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
