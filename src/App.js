import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SellerProfilePage from "./pages/SellerProfilePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MarketplacePage from "./pages/MarketplacePage";
import { loadSavedTheme } from "./styles/themes";
import "./styles.css";

// Beautiful Homepage Component (inline)
const BeautifulHomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#000",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              🔗
            </div>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#000" }}>
              BookaLink
            </span>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "10px 24px",
                background: "transparent",
                border: "none",
                borderRadius: "30px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                color: "#000",
              }}
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={{
                padding: "10px 24px",
                background: "#000",
                border: "none",
                borderRadius: "30px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                color: "#fff",
              }}
            >
              Sign up free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)",
          padding: "120px 20px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h1
            style={{
              fontSize: "clamp(40px, 8vw, 72px)",
              fontWeight: 900,
              color: "#1E3A20",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            Your link in bio,
            <br />
            built for selling.
          </h1>
          <p
            style={{
              fontSize: "clamp(18px, 4vw, 24px)",
              color: "#2A5A2D",
              marginBottom: "40px",
              lineHeight: 1.5,
            }}
          >
            Turn your followers into customers. One link to sell products, services, events, and
            digital downloads — all with instant payments.
          </p>

          <div
            style={{
              background: "#fff",
              borderRadius: "50px",
              padding: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <input
              type="text"
              placeholder="bookalink.com/yourname"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "16px 24px",
                fontSize: "16px",
                background: "transparent",
              }}
            />
            <button
              onClick={() => navigate("/signup")}
              style={{
                padding: "14px 32px",
                background: "#1E3A20",
                color: "#fff",
                border: "none",
                borderRadius: "40px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Claim your link
            </button>
          </div>

          <p style={{ marginTop: "16px", fontSize: "14px", color: "#2A5A2D" }}>
            It's free, and takes less than a minute 🚀
          </p>
        </div>
      </section>

      {/* Features Section 1 */}
      <section style={{ background: "#FFF8E1", padding: "100px 20px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "60px",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "clamp(32px, 6vw, 48px)",
                fontWeight: 900,
                color: "#5D4E37",
                marginBottom: "24px",
                lineHeight: 1.2,
              }}
            >
              Sell products, collect payments and{" "}
              <span style={{ color: "#F59E0B" }}>make monetization simple</span>
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#6B5D48",
                lineHeight: 1.6,
                marginBottom: "32px",
              }}
            >
              Accept payments with Apple Pay and credit cards. Sell digital products, physical
              items, event tickets, and services — all from one link.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            {[
              { emoji: "💄", price: "$15", bg: "#C084FC" },
              { emoji: "🧢", price: "$25", bg: "#FB923C" },
              { emoji: "👕", price: "$45", bg: "#EC4899" },
              { emoji: "🎵", price: "$35", bg: "#06B6D4" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: item.bg,
                  borderRadius: "24px",
                  padding: "32px 24px",
                  textAlign: "center",
                  minWidth: "140px",
                  transform: i % 2 === 0 ? "translateY(-20px)" : "translateY(20px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ fontSize: "60px", marginBottom: "12px" }}>{item.emoji}</div>
                <div style={{ fontSize: "24px", fontWeight: 900, color: "#fff" }}>
                  {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace CTA */}
      <section style={{ background: "#1E293B", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 6vw, 48px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "24px",
            }}
          >
            Browse creators already selling
          </h2>
          <p style={{ fontSize: "18px", color: "#94A3B8", marginBottom: "40px" }}>
            See what other creators are offering on BookaLink
          </p>
          <button
            onClick={() => navigate("/marketplace")}
            style={{
              padding: "16px 40px",
              background: "#10B981",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              fontSize: "18px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(16, 185, 129, 0.3)",
            }}
          >
            🛍️ Browse Marketplace
          </button>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(36px, 7vw, 56px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "24px",
              lineHeight: 1.2,
            }}
          >
            Start selling in minutes
          </h2>
          <p
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "40px",
            }}
          >
            Create your BookaLink, add products, share your link. It's that simple.
          </p>

          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "20px 48px",
              background: "#fff",
              color: "#8B5CF6",
              border: "none",
              borderRadius: "50px",
              fontSize: "20px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            Get started for free 🚀
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#000", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "16px",
            }}
          >
            🔗 BookaLink
          </div>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            © 2024 BookaLink. Turn followers into customers.
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  useEffect(() => {
    loadSavedTheme();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Beautiful Homepage - Inline component */}
          <Route path="/" element={<BeautifulHomePage />} />

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
