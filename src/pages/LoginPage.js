import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { supabase } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      console.log("Login successful:", data.user.email);

      // Use navigate instead of window.location
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {/* Logo */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "var(--text-on-bg)",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          BookaLink
        </h1>

        {/* Login Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "3px solid #000000",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              marginBottom: "24px",
            }}
          >
            Log in to your account
          </p>

          {error && (
            <div
              style={{
                padding: "12px",
                background: "#FEE",
                border: "2px solid #FCC",
                borderRadius: "8px",
                marginBottom: "16px",
                color: "#C33",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hubspot-button"
              style={{ marginBottom: 0 }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "2px solid #EFEFEF",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#666666",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#000000",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "14px",
              color: "var(--text-on-bg)",
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
