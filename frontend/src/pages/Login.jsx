import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ThemeToggle from "../component/ThemeToggle";
import "./auth.css";

function Login() {
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
      setError(
        err.response?.data?.message || "Authentication rejected. Invalid credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 10000 }}>
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
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
            </svg>
          </div>
        </div>
        <div className="auth-card-header">
          <h1>UpTime Operator Login</h1>
          <p>Provide secure credentials to establish node link.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

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
            {loading ? "Establishing Link..." : "Establish Link"}
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

        <div className="auth-footer">
          New node? <Link to="/register">Register employee node</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

