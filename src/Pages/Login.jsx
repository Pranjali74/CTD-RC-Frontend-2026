import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Connect your real authentication API here.
    navigate("/instructions");
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


          <button
            className="primary-btn login-btn"
            type="submit"
          >
            Login
          </button>

        </form>

      </section>

    </main>
  );
}