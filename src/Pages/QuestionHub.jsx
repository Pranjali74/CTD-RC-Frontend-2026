import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { logout } from "../auth/auth";
import Timer from "../components/Timer";
import rcLogo from "../assets/rc-logo.png";
import "../App.css";

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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get("/problems/accuracy")
      .then((response) => {
        if (active) {
          setQuestions(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch(() => {
        if (active) setError("Unable to load questions. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
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

        <div className="qh-event-timer">
          <Timer />
        </div>

        {/* Question Cards */}
        <div className="question-grid">
          {questions.map((item, index) => {
            const progress = Math.min(100, Math.max(0, Number.parseFloat(item.accuracy) || 0));
            const solved = Boolean(localStorage.getItem(`solved_${item.problem_id}`));

            return (
            <article
              className="question-card"
              key={item.problem_id}
            >
              <ProgressCircle
                label={`Q${index + 1}`}
                progress={progress}
                solved={solved}
              />

              <button
                type="button"
                className="solve-btn"
                onClick={() => navigate(`/question/${item.problem_id}`, {
                  state: { questionId: item.problem_id, problem_id: item.problem_id },
                })}
              >
                Solve
              </button>
            </article>
            );
          })}
          {loading && <p className="question-hub-message">Loading questions...</p>}
          {error && <p className="question-hub-message" role="alert">{error}</p>}
          {!loading && !error && questions.length === 0 && (
            <p className="question-hub-message">No questions are available.</p>
          )}
        </div>
      </section>
    </main>
  );
}