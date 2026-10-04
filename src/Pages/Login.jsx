import { useEffect, useRef, useState } from "react";
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
  const [showCategory, setShowCategory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categoryRef = useRef(null);


  /* =========================================================
     CLOSE CATEGORY DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setShowCategory(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);


  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    const cleanTeamname = teamname.trim();

    /* -----------------------------------------
       FRONTEND VALIDATION
    ----------------------------------------- */

    if (!cleanUsername) {
      setError("Please enter your username.");
      return;
    }

    if (!cleanPassword) {
      setError("Please enter your password.");
      return;
    }

    if (!cleanTeamname) {
      setError("Please enter your team name.");
      return;
    }


    setLoading(true);


    try {
      /* -----------------------------------------
         CLEAR OLD AUTH DATA
      ----------------------------------------- */

      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isVerified");


      /* -----------------------------------------
         BACKEND LOGIN REQUEST
      ----------------------------------------- */

      const response = await api.post(
        "/user/login",
        {
          username: cleanUsername,
          password: cleanPassword,
          teamname: cleanTeamname,

          // CTD RC event
          event_id: 1,

          // false = Senior
          // true  = Junior
          isjunior,

          isVerified: false,
        }
      );


      const data = response.data || {};


      /* -----------------------------------------
         SAVE AUTHENTICATION DATA
      ----------------------------------------- */

      if (data.user !== undefined) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(data.user)
        );
      }

      if (data.isVerified !== undefined) {
        localStorage.setItem(
          "isVerified",
          String(data.isVerified)
        );
      }

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }


      /* -----------------------------------------
         SUCCESS
      ----------------------------------------- */

      if (data.token) {
        navigate("/instructions", {
          replace: true,
        });

        return;
      }

      /*
       * If backend responds successfully but
       * doesn't provide a token, don't pretend
       * authentication succeeded.
       */

      // setError(
      //   "Login succeeded, but no authentication token was received."
      // );
      navigate("/instructions");

    } catch (requestError) {
      console.error(
        "Login failed:",
        requestError
      );

      const status =
        requestError.response?.status;

      const responseData =
        requestError.response?.data || {};


      /* -----------------------------------------
         SPECIAL 501 FLOW
      ----------------------------------------- */

      if (status === 501) {
        if (
          responseData.isVerified !==
          undefined
        ) {
          localStorage.setItem(
            "isVerified",
            String(
              responseData.isVerified
            )
          );
        }

        navigate("/results", {
          replace: true,
        });

        return;
      }


      /* -----------------------------------------
         NORMAL ERROR
      ----------------------------------------- */

      setError(
        responseData.error ||
          responseData.message ||
          "Unable to log in. Please check your credentials and try again."
      );

    } finally {
      setLoading(false);
    }
  };


  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="login-page">

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <section className="login-left">

        <div className="event-copy">

          <div className="event-kicker">
            CTD
          </div>

          <h1>
            <span>&lt;/&gt;</span>{" "}
            Reverse Coding{" "}
            <span>&lt;/&gt;</span>
          </h1>

          <p>
            Think • Code • Build
          </p>

          <small>
            Turn your ideas into working solutions
          </small>

        </div>

      </section>


      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <section className="login-card">

        <h2>
          Login
        </h2>


        <form onSubmit={handleLogin}>

          {/* =================================================
              USERNAME
          ================================================= */}

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
              onChange={(e) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
              required
            />

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <label htmlFor="password">
            PASSWORD
          </label>

          <div className="input-wrap">

            <span className="input-icon">
              ▣
            </span>

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword
                ? "◉"
                : "◌"}
            </button>

          </div>


          {/* =================================================
              TEAM NAME
          ================================================= */}

          <label htmlFor="teamname">
            TEAM NAME
          </label>

          <div className="input-wrap">

            <span
              className="input-icon"
              aria-hidden="true"
            >
              ♜
            </span>

            <input
              id="teamname"
              type="text"
              placeholder="Enter your team name"
              value={teamname}
              onChange={(e) =>
                setTeamname(e.target.value)
              }
              required
            />

          </div>


          {/* =================================================
              CATEGORY
          ================================================= */}

         <label htmlFor="category">
              CATEGORY
            </label>

            <div
              className={`category-dropdown ${
                showCategory ? "open" : ""
              }`}
              ref={categoryRef}
            >
              <button
                type="button"
                id="category"
                className="category-select"
                onClick={() =>
                  setShowCategory((value) => !value)
                }
                aria-haspopup="listbox"
                aria-expanded={showCategory}
              >
                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  ◆
                </span>

                <span className="category-value">
                  {isjunior ? "Junior" : "Senior"}
                </span>

                <span
                  className={`category-arrow ${
                    showCategory ? "rotated" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {showCategory && (
                <div
                  className="category-options"
                  role="listbox"
                >
                  <button
                    type="button"
                    className={`category-option ${
                      !isjunior ? "selected" : ""
                    }`}
                    onClick={() => {
                      setIsjunior(false);
                      setShowCategory(false);
                    }}
                  >
                    <span>Senior</span>

                    {!isjunior && (
                      <span className="category-check">
                        ✓
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`category-option ${
                      isjunior ? "selected" : ""
                    }`}
                    onClick={() => {
                      setIsjunior(true);
                      setShowCategory(false);
                    }}
                  >
                    <span>Junior</span>

                    {isjunior && (
                      <span className="category-check">
                        ✓
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <p
              className="login-error"
              role="alert"
            >
              {error}
            </p>
          )}


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            className="primary-btn login-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>

      </section>

    </main>
  );
}