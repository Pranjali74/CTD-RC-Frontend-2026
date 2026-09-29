import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { logout } from "../auth/auth";
import "../App.css";



export default function Leaderboard() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    let active = true;

    api.get("/leaderboard/")
      .then((response) => {
        if (active) setTeams(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setTeams([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
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
              {teams.map((team, index) => (
                <tr key={team.team_id ?? team.teamname ?? index}>
                  <td>{index + 1}</td>
                  <td>{team.teamname}</td>
                  <td>{team.problem_1 ?? 0}</td>
                  <td>{team.problem_2 ?? 0}</td>
                  <td>{team.problem_3 ?? 0}</td>
                  <td>{team.problem_4 ?? 0}</td>
                  <td>{team.total_score ?? 0}</td>
                  <td>
                    {team.last_submission_time
                      ? new Date(team.last_submission_time).toLocaleTimeString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {!loading && teams.length === 0 && (
                <tr><td colSpan="8">No participants yet</td></tr>
              )}
              {loading && <tr><td colSpan="8">Loading leaderboard...</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
