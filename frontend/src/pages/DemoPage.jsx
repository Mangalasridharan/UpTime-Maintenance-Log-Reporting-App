import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cpu,
  Sparkles,
  Wrench,
  HardHat,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Activity
} from "lucide-react";
import ThemeToggle from "../component/ThemeToggle";
import uptimeLogo from "../assets/uptime.png";
import "./demo.css";

export default function DemoPage() {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    navigate("/login");
  };

  return (
    <div className="demo-page-root">
      {/* Header */}
      <header className="demo-header">
        <div className="demo-header-inner">
          <Link to="/" className="demo-brand">
            <img src={uptimeLogo} alt="UpTime Logo" className="landing-brand-logo" />
            <div className="brand-text-group">
              <span className="brand-name">UPTIME</span>
              <span className="brand-tag">DEMO SANDBOX</span>
            </div>
          </Link>

          <div className="demo-header-actions">
            <Link to="/" className="btn-back-home">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Demo Content */}
      <main className="demo-main">
        <div className="demo-container">
          {/* Hero Banner */}
          <div className="demo-hero">
            <div className="demo-badge">
              <Sparkles size={15} />
              <span>Interactive Plant Environment</span>
            </div>
            <h1 className="demo-title">
              Experience Uptime in Action
            </h1>
            <p className="demo-subtitle">
              Test drive the platform with simulated factory telemetry, active breakdown complaints,
              and intelligent technician dispatch.
            </p>

            <div className="demo-quick-action">
              <button
                onClick={handleTryDemo}
                className="btn-launch-primary"
              >
                <span>Go to Login Page</span>
                <ArrowRight size={18} />
              </button>
              <span className="demo-quick-hint">
                Sign in to explore the console · Pre-populated with 48 factory machines & live telemetry
              </span>
            </div>
          </div>

          {/* Role Persona Selection */}
          <div className="demo-personas-section">
            <div className="personas-header">
              <h3>Choose a Persona to Explore</h3>
              <p>Each role gives you a tailored view of the factory maintenance workflow.</p>
            </div>

            <div className="personas-grid">
              {/* Persona 1: Maintenance Worker */}
              <div className="persona-card">
                <div className="persona-top">
                  <div className="persona-icon-box worker">
                    <Wrench size={24} />
                  </div>
                  <span className="persona-tag">Field Specialist</span>
                </div>
                <h4 className="persona-title">Maintenance Worker</h4>
                <p className="persona-desc">
                  Receive assigned repair tasks on your mobile or terminal. Log parts used, update repair progress, and view your monthly performance grade.
                </p>
                <div className="persona-features">
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Real-time assigned work queue</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Machine breakdown history lookup</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Tier scoring & attendance metrics</span>
                  </div>
                </div>
                <button
                  onClick={handleTryDemo}
                  className="btn-try-persona"
                >
                  <span>Try Demo as Maintenance Worker</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Persona 2: Machine Operator */}
              <div className="persona-card featured">
                <div className="featured-ribbon">Recommended</div>
                <div className="persona-top">
                  <div className="persona-icon-box operator">
                    <HardHat size={24} />
                  </div>
                  <span className="persona-tag">Shop Floor</span>
                </div>
                <h4 className="persona-title">Machine Operator</h4>
                <p className="persona-desc">
                  Track assigned production equipment. Submit morning, afternoon, and evening routine meter photos and raise instant breakdown complaints.
                </p>
                <div className="persona-features">
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Shift reading slot photo upload</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Rapid anomaly & breakdown ticket</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>Live machine running/idle status</span>
                  </div>
                </div>
                <button
                  onClick={handleTryDemo}
                  className="btn-try-persona primary"
                >
                  <span>Try Demo as Machine Operator</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Sandbox Info Callout */}
          <div className="demo-info-card">
            <div className="info-icon-wrapper">
              <Activity size={28} className="text-emerald" />
            </div>
            <div className="info-text">
              <h4>Interactive Factory Simulation</h4>
              <p>
                The Uptime demo environment is pre-configured with real-world textile and industrial machinery
                across 12 departments (Boiler, CBR, CDR, CPB, CWR, Fabric Batching, Finishing, Softflow, etc.).
                Clicking any demo action will take you to the sign-in page where you can access the console.
              </p>
            </div>
            <div className="info-action">
              <button
                onClick={handleTryDemo}
                className="btn-info-action"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}