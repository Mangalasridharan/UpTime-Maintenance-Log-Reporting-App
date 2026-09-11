import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import ThemeToggle from "../component/ThemeToggle";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import "./auth.css";

function Login() {
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const isDemo = location.search.includes("demo=true");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get("role") || sessionStorage.getItem("demoRole");
    const demoEmail = sessionStorage.getItem("demoEmail");

    if (demoEmail) {
      setEmployeeEmail(demoEmail);
      setPassword("demo123");
    } else if (roleParam) {
      setEmployeeEmail(`demo.${roleParam.toLowerCase()}@uptime.com`);
      setPassword("demo123");
    }
  }, [location]);

  const handleDemoAutofill = (role, email) => {
    setEmployeeEmail(email);
    setPassword("demo123");
    setError("");
  };

  const handleBypassDemoLogin = (role = "HOD") => {
    localStorage.setItem("token", "uptime-demo-session-token");
    localStorage.setItem("role", role);
    localStorage.setItem(
      "username",
      role === "HEAD"
        ? "Plant Director"
        : role === "HOD"
        ? "Boiler Department HOD"
        : "Senior Technician"
    );
    localStorage.setItem("email", employeeEmail || `demo.${role.toLowerCase()}@uptime.com`);
    localStorage.setItem("employeeId", "1");
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/v1/employee/auth/login", {
        email: employeeEmail,
        password: password,
      });

      localStorage.setItem("token", response.data.jwtToken);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("email", employeeEmail);
      if (response.data.id) {
        localStorage.setItem("employeeId", response.data.id);
      }

      navigate("/dashboard");
    } catch (err) {
      // If server rejected or offline, provide clear error message and quick demo access
      const msg =
        err.response?.data?.message ||
        "Authentication rejected. Invalid credentials (or backend offline).";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      {/* Top action bar */}
      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10 }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            textDecoration: "none",
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
            fontWeight: 600,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            padding: "0.45rem 0.85rem",
            borderRadius: "8px",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div className="auth-card">
        <div className="auth-logo-container">
          <div className="auth-logo">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="2" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
            </svg>
          </div>
        </div>
        <div className="auth-card-header">
          <h1>UpTime Console Login</h1>
          <p>Provide secure credentials to enter UpTime Console</p>
        </div>

        {/* Demo Mode Banner */}
        {isDemo && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "0.6rem 0.85rem",
              borderRadius: "10px",
              marginBottom: "1.25rem",
              fontSize: "0.82rem",
              color: "#10b981",
              fontWeight: 600,
            }}
          >
            <Sparkles size={16} />
            <span>Demo Mode Active · Credentials pre-configured</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
            <div style={{ marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => handleBypassDemoLogin("HOD")}
                style={{
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Enter Demo Console Directly →
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="name@company.com"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">ACCESS PASSWORD</label>
            <div className="form-input-container">
              <input
                id="password"
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Establishing Link..." : "Sign In"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px dashed var(--border-color)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Demo Quick Access
          </span>
          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleDemoAutofill("HOD", "hod@uptime.com")}
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              HOD Fill
            </button>
            <button
              type="button"
              onClick={() => handleDemoAutofill("HEAD", "head@uptime.com")}
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Head Fill
            </button>
            <button
              type="button"
              onClick={() => handleBypassDemoLogin("HOD")}
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#10b981",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.3rem 0.6rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Direct Sandbox →
            </button>
          </div>
        </div>

        <div className="auth-footer">
          New Employee? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
