import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const instructions = [
  "There will be 4 problems in total. Each problem will carry equal score.",
  "Time duration: 60 minutes.",
  "There will be no penalty for wrong submissions.",
  "Use of AI tools, external help, or any form of cheating is strictly prohibited. All codes will be checked for plagiarism — violators will be disqualified.",
  "Exiting the full screen or switching tabs 3 times will log out the user automatically.",
];

export default function Instructions() {
  const navigate = useNavigate();

  return (
    <main className="event-page">
      <header className="topbar">
        <img
        src="/src/assets/rc-logo.png"
        alt="RC"
        className="brand-logo"
/>
        <nav>
          <button className="nav-link active">INSTRUCTIONS</button>
          <button className="nav-link" onClick={() => navigate("/question-hub")}>QUESTION HUB</button>
          <button className="nav-link" onClick={() => navigate("/leaderboard")}>LEADERBOARDS</button>
          <button className="nav-link" onClick={() => navigate("/results")}>RESULTS</button>
        </nav>
        <button className="logout-btn" onClick={() => navigate("/")}>LOGOUT</button>
      </header>

      <section className="content instructions-content">
        <div className="page-heading">
          <h1>INSTRUCTIONS</h1>
          <span />
        </div>

        <div className="instruction-list">
          {instructions.map((item, index) => (
            <article className="instruction-row" key={item}>
              <div className="instruction-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p>{item}</p>
              <div className="instruction-icon">
                {["♧", "◷", "▤", "⚠", "↗"][index]}
              </div>
            </article>
          ))}
        </div>

        <button
          className="primary-btn proceed-btn"
          onClick={() => navigate("/question-hub")}
        >
          PROCEED <span>→</span>
        </button>
      </section>
    </main>
  );
}
