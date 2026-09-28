import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import "./Navbar.css";

// CHANGE THIS PATH to your actual logo filename
import rcLogo from "../assets/rc-logo.png";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="main-navbar">

      {/* RC LOGO */}
      <div
        className="navbar-logo"
        onClick={() => navigate("/question-hub")}
      >
        <img src={rcLogo} alt="RC Logo" />
      </div>

      {/* NAVIGATION */}
      <div className="navbar-links">

        <NavLink
          to="/instructions"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          INSTRUCTIONS
        </NavLink>

        <NavLink
          to="/question-hub"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          QUESTION HUB
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          LEADERBOARDS
        </NavLink>

        <NavLink
          to="/results"
          className={({ isActive }) =>
            `navbar-link ${isActive ? "active" : ""}`
          }
        >
          RESULTS
        </NavLink>

      </div>

      {/* LOGOUT */}
      <button
        className="navbar-logout"
        onClick={handleLogout}
      >
        LOGOUT
      </button>

    </nav>
  );
}

export default Navbar;