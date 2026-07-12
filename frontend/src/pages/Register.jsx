import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ThemeToggle from "../component/ThemeToggle";
import "./auth.css";

function Register() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [deptId, setDeptId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/v1/employee/auth/register", {
        username: employeeName,
        email: employeeEmail,
        password: password,
        employeeRole: employeeRole,
        departmentId: deptId,
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Verification rejected."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M6 21l3-9" />
              <circle cx="9" cy="12" r="1.5" fill="white" />
              <path d="M9 12h7l4-4" />
              <circle cx="16" cy="12" r="1" fill="white" />
              <path d="M20 8l-2-2" />
              <path d="M20 8v3" />
              <line x1="20" y1="11" x2="20" y2="15" strokeDasharray="2,2" />
            </svg>
          </div>
        </div>
        <div className="auth-card-header">
          <h1>Operator Registration</h1>
          <p>Register new operator node to gain access to the console.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">OPERATOR FULL NAME</label>
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="John Doe"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
              />
            </div>

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
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">ACCESS PASSWORD</label>
            <div className="form-input-container">
              <input
                id="password"
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
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

          <div className="form-row">
            {/* Role selection */}
            <div className="form-group">
              <label htmlFor="role">EMPLOYEE ROLE</label>
              <select
                id="role"
                className="form-select"
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="HEAD">Head</option>
                <option value="HOD">HOD</option>
                <option value="SHIFT_WORKER">Shift Worker</option>
                <option value="GENERAL_WORKER">General Worker</option>
              </select>
            </div>

            {/* Department selection */}
            <div className="form-group">
              <label htmlFor="dept">ASSIGNED DEPARTMENT</label>
              <select
                id="dept"
                className="form-select"
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Department
                </option>
                <option value="1">Boiler</option>
                <option value="2">CBR</option>
                <option value="3">CDR</option>
                <option value="4">CPB</option>
                <option value="5">CWR</option>
                <option value="6">Fabric Batching</option>
                <option value="7">Finishing-Dry</option>
                <option value="8">Finishing-Wet</option>
                <option value="9">Inspection</option>
                <option value="10">Printing</option>
                <option value="11">Softflow</option>
                <option value="12">Softflow-Sample</option>
                <option value="13">Winding</option>
                <option value="14">Yarn Dyeing</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Provisioning..." : "Provision Node"}
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
          Already registered? <Link to="/">Establish link</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
