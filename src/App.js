import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SellerProfilePage from "./pages/SellerProfilePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { loadSavedTheme } from "./styles/themes";
import "./styles.css";
import MarketplacePage from "./pages/MarketplacePage";

function App() {
  useEffect(() => {
    loadSavedTheme();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--bg-page)",
                  color: "var(--text-on-bg)",
                  padding: "20px",
                }}
              >
                <div style={{ textAlign: "center", maxWidth: "600px" }}>
                  <h1
                    style={{
                      fontSize: "clamp(36px, 8vw, 48px)",
                      marginBottom: "16px",
                      fontWeight: 700,
                    }}
                  >
                    BookaLink
                  </h1>
                  <p
                    style={{
                      fontSize: "clamp(16px, 4vw, 18px)",
                      marginBottom: "32px",
                    }}
                  >
                    Turn followers into customers
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <a href="/marketplace" style={{ textDecoration: "none" }}>
                      <button
                        className="hubspot-button"
                        style={{
                          marginBottom: 0,
                          width: "auto",
                          padding: "12px 24px",
                          fontSize: "clamp(14px, 3.5vw, 16px)",
                          background: "var(--primary-color)",
                          color: "#FFFFFF",
                        }}
                      >
                        🛍️ Browse Marketplace
                      </button>
                    </a>
                    <a href="/login" style={{ textDecoration: "none" }}>
                      <button
                        className="hubspot-button"
                        style={{
                          marginBottom: 0,
                          width: "auto",
                          padding: "12px 24px",
                          fontSize: "clamp(14px, 3.5vw, 16px)",
                        }}
                      >
                        Log In
                      </button>
                    </a>
                    <a href="/signup" style={{ textDecoration: "none" }}>
                      <button
                        className="hubspot-button"
                        style={{
                          marginBottom: 0,
                          width: "auto",
                          padding: "12px 24px",
                          fontSize: "clamp(14px, 3.5vw, 16px)",
                        }}
                      >
                        Sign Up
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/:username" element={<SellerProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
