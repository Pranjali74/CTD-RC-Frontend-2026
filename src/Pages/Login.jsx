import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [teamname, setTeamname] = useState("");
  const [isjunior, setIsjunior] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/user/login", {
        username: username.trim(),
        password: password.trim(),
        teamname: teamname.trim(),
        event_id: 1,
        isjunior,
        isVerified: false,
      });

      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
      localStorage.setItem("isVerified", response.data.isVerified);
      localStorage.setItem("token", response.data.token);
      navigate("/instructions");
    } catch (requestError) {
      const responseData = requestError.response?.data;
      setError(responseData?.error || responseData?.message || "Unable to log in. Please try again.");

      if (requestError.response?.status === 501) {
        if (responseData?.isVerified !== undefined) {
          localStorage.setItem("isVerified", responseData.isVerified);
        }
        navigate("/results");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      {/* LEFT SIDE */}
      <section className="login-left">
        <div className="event-copy">
          <div className="event-kicker">
            CTD
          </div>

          <h1>
            <span>&lt;/&gt;</span> Reverse Coding <span>&lt;/&gt;</span>
          </h1>

          <p>Think • Code • Build</p>

          <small>
            Turn your ideas into working solutions
          </small>
        </div>
      </section>


      {/* LOGIN CARD */}
      <section className="login-card">

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <label htmlFor="username">
            USERNAME
          </label>

          <div className="input-wrap">
            <span className="input-icon">
              ♟
            </span>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>


          <label htmlFor="password">
            PASSWORD
          </label>

          <div className="input-wrap">
            <span className="input-icon">
              ▣
            </span>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "◉" : "◌"}
            </button>
          </div>


          <label htmlFor="teamname">
            TEAM NAME
          </label>

          <div className="input-wrap">
            <span className="input-icon" aria-hidden="true">♜</span>
            <input
              id="teamname"
              type="text"
              placeholder="Enter your team name"
              value={teamname}
              onChange={(e) => setTeamname(e.target.value)}
              required
            />
          </div>

          <label htmlFor="level">
            CATEGORY
          </label>

          <div className="input-wrap">
            <span className="input-icon" aria-hidden="true">◆</span>
            <select
              id="level"
              value={isjunior ? "junior" : "senior"}
              onChange={(e) => setIsjunior(e.target.value === "junior")}
            >
              <option value="senior">Senior</option>
              <option value="junior">Junior</option>
            </select>
          </div>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button
            className="primary-btn login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

      </section>

    </main>
  );
}