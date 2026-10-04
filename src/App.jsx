import React, { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./Pages/Login";
import Instructions from "./Pages/Instructions";
import QuestionHub from "./Pages/QuestionHub";
import Leaderboard from "./Pages/Leaderboard";

import CodeEditor from "./Pages/CodeEditor";
import Results from "./Pages/Results";
import Submissions from "./Pages/Submissions";

import { logout } from "./auth/auth";

import "./App.css";


/* =========================================================
   FULLSCREEN MONITOR
========================================================= */

function FullscreenMonitor() {
  const location = useLocation();
  const navigate = useNavigate();

  const violations = useRef(
    Number(
      sessionStorage.getItem("fullscreenViolations") || 0
    )
  );

  /*
   * Fullscreen monitoring is active only
   * after the user enters the contest.
   */
  const excludedPages = [
    "/",
    "/login",
    "/instructions",
    "/results",
  ];

  const shouldMonitor =
    !excludedPages.includes(location.pathname);


  useEffect(() => {
    if (!shouldMonitor) {
      return;
    }

    const handleFullscreenChange = () => {

      // User is still in fullscreen
      if (document.fullscreenElement) {
        return;
      }

      violations.current += 1;

      sessionStorage.setItem(
        "fullscreenViolations",
        String(violations.current)
      );

      console.log(
        `Fullscreen violation: ${violations.current}/3`
      );


      /* =========================================
         THIRD VIOLATION
      ========================================= */

      if (violations.current >= 3) {

        sessionStorage.removeItem(
          "fullscreenViolations"
        );

        logout();

        alert(
          "You have exited fullscreen 3 times. You have been logged out."
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }


      /* =========================================
         FIRST / SECOND VIOLATION
      ========================================= */

      alert(
        `Warning ${violations.current}/3\n\n` +
        "You must remain in fullscreen mode during the contest."
      );

      /*
       * Try to return to fullscreen.
       * The browser may reject this because
       * fullscreen normally requires a user gesture.
       */
      document.documentElement
        .requestFullscreen()
        .catch(() => {});
    };


    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );


    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };

  }, [shouldMonitor, navigate]);


  return null;
}


/* =========================================================
   APP ROUTES
========================================================= */

function AppRoutes() {

  const location = useLocation();


  /*
   * Pages where fullscreen monitoring
   * should not run.
   */
  const excludedPages = [
    "/",
    "/login",
    "/instructions",
    "/results",
  ];

  const showFullscreenMonitor =
    !excludedPages.includes(location.pathname);


  return (
    <>
      {showFullscreenMonitor && (
        <FullscreenMonitor />
      )}

      <Routes>

        {/* =========================
            PUBLIC
        ========================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================
            INSTRUCTIONS
        ========================= */}

        <Route
          path="/instructions"
          element={<Instructions />}
        />


        {/* =========================
            CONTEST PAGES
        ========================= */}

        <Route
          path="/question-hub"
          element={<QuestionHub />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route
          path="/code-editor"
          element={<CodeEditor />}
        />

        <Route
          path="/submissions"
          element={<Submissions />}
        />

        <Route
          path="/results"
          element={<Results />}
        />


        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/question-hub"
              replace
            />
          }
        />

      </Routes>
    </>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}