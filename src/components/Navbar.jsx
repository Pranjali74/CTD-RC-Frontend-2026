import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../App.css";

import rcLogo from "../assets/rc-logo.png";

const navItems = [
  {
    label: "INSTRUCTIONS",
    path: "/instructions",
  },
  {
    label: "QUESTION HUB",
    path: "/question-hub",
  },
  {
    label: "LEADERBOARDS",
    path: "/leaderboard",
  },
  {
    label: "RESULTS",
    path: "/results",
  },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="site-navbar">
      {/* RC LOGO */}
      <Link to="/instructions" className="site-navbar-logo">
        <img src={rcLogo} alt="RC Logo" />
      </Link>

      {/* NAVIGATION */}
      <nav className="site-navbar-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`site-navbar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* LOGOUT */}
      <button
        type="button"
        className="site-navbar-logout"
        onClick={handleLogout}
      >
        LOGOUT
      </button>
    </header>
  );
};

export default Navbar;