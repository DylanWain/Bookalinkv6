import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { supabase } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    setLoading(true);

    try {
      // Check if username exists
      const { data: existingUser } = await supabase
        .from("sellers")
        .select("username")
        .eq("username", formData.username.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        throw new Error("Username already taken");
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username.toLowerCase(),
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create account");
      }

      console.log("Auth user created:", authData.user.id);

      // Create seller profile
      const { error: insertError } = await supabase.from("sellers").insert([
        {
          id: authData.user.id,
          user_id: authData.user.id,
          name: formData.fullName,
          business_name: formData.fullName,
          username: formData.username.toLowerCase(),
          email: formData.email,
          bio: "",
          category: "other",
          portfolio: [],
        },
      ]);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error("Failed to create profile: " + insertError.message);
      }

      console.log("Seller profile created successfully");

      // Check if email confirmation is required
      if (authData.session) {
        // Auto logged in (email confirmation disabled)
        alert("Account created successfully! Redirecting to dashboard...");
        window.location.href = "/dashboard";
      } else {
        // Email confirmation required
        alert(
          "Account created! Please check your email to verify your account, then log in."
        );
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account");
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

        {/* Signup Card */}
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
            Create your account
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              marginBottom: "24px",
            }}
          >
            Start taking bookings in minutes
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

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
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

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
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
              <div
                style={{
                  fontSize: "12px",
                  color: "#666666",
                  marginTop: "4px",
                }}
              >
                Your profile will be at bookalink.com/
                {formData.username || "username"}
              </div>
            </div>

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

            <div style={{ marginBottom: "16px" }}>
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
                minLength="6"
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
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
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
              {loading ? "Creating account..." : "Sign Up"}
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
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#000000",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Log in
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

export default SignupPage;
