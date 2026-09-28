import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import rcLogo from "../assets/rc-logo.png";
import "../App.css";

const questions = [
  { id: "Q1", progress: 25, solved: false },
  { id: "Q2", progress: 50, solved: false },
  { id: "Q3", progress: 75, solved: false },
  { id: "Q4", progress: 100, solved: true },
];

const navItems = [
  { label: "INSTRUCTIONS", path: "/instructions" },
  { label: "QUESTION HUB", path: "/question-hub" },
  { label: "LEADERBOARDS", path: "/leaderboard" },
  { label: "RESULTS", path: "/results" },
];

function ProgressCircle({ label, progress, solved }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="qh-progress-wrapper">
      <svg
        className="qh-progress"
        width="82"
        height="82"
        viewBox="0 0 82 82"
      >
        <circle
          className="qh-progress-track"
          cx="41"
          cy="41"
          r={radius}
        />

        <circle
          className="qh-progress-value"
          cx="41"
          cy="41"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <span className="qh-progress-label">
        {label}
      </span>

      {solved && (
        <span className="qh-check">
          ✓
        </span>
      )}
    </div>
  );
}

export default function QuestionHub() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <main className="question-hub-page">
      {/* =========================
          TOP NAVIGATION
      ========================== */}
      <header className="top-nav">
        <Link to="/question-hub" className="nav-logo-link">
          <img
            src={rcLogo}
            alt="RC"
            className="nav-logo"
          />
        </Link>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path
                  ? "active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </header>

      {/* =========================
          PAGE CONTENT
      ========================== */}
      <section className="question-hub-content">

        {/* Heading */}
        <div className="question-hub-heading">
          <div className="qh-heading-icon" aria-hidden="true">
            ♜
          </div>

          <div>
            <h1>QUESTION HUB</h1>
            <p>Choose a question to start coding</p>
          </div>
        </div>

        {/* Question Cards */}
        <div className="question-grid">
          {questions.map((item) => (
            <article
              className="question-card"
              key={item.id}
            >
              <ProgressCircle
               label={item.id}
              progress={item.progress}
             solved={item.solved}
              />

              <button
                type="button"
                className="solve-btn"
                onClick={() =>
                  console.log(`Solve ${item.id}`)
                }
              >
                Solve
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}