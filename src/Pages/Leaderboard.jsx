import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";



export default function Leaderboard() {
  const navigate = useNavigate();

  return (
    <main className="event-page">
      <header className="topbar">
        <div className="brand">RC</div>
        <nav>
          <button className="nav-link" onClick={() => navigate("/instructions")}>INSTRUCTIONS</button>
          <button className="nav-link" onClick={() => navigate("/question-hub")}>QUESTION HUB</button>
          <button className="nav-link active">LEADERBOARDS</button>
          <button className="nav-link" onClick={() => navigate("/results")}>RESULTS</button>
        </nav>
        <button className="logout-btn" onClick={() => navigate("/")}>LOGOUT</button>
      </header>

      <section className="content leaderboard-content">
        <div className="hub-heading leaderboard-heading">
          <div className="trophy">♜</div>
          <div>
            <h1>LEADERBOARDS</h1>
            <p>Top performers in the event</p>
          </div>
        </div>

        <div className="leaderboard-shell">
          <table>
            <thead>
              <tr>
                <th>#</th><th>User</th><th>Q1</th><th>Q2</th><th>Q3</th>
                <th>Q4</th><th>Total</th><th>Time</th>
              </tr>
            </thead>
            <tbody>
            
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
