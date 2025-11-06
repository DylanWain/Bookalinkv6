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
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <h1
                    style={{
                      fontSize: "48px",
                      marginBottom: "16px",
                      fontWeight: 700,
                    }}
                  >
                    BookaLink
                  </h1>
                  <p style={{ fontSize: "18px", marginBottom: "24px" }}>
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
                    <a href="/login" style={{ textDecoration: "none" }}>
                      <button
                        className="hubspot-button"
                        style={{
                          marginBottom: 0,
                          width: "auto",
                          padding: "12px 24px",
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
          <Route path="/:username" element={<SellerProfilePage />} />

          <Route path="/marketplace" element={<MarketplacePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
