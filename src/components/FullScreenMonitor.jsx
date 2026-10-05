import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";

const EXCLUDED_PAGES = [
  "/",
  "/login",
  "/instructions",
  "/results",
];

const MAX_VIOLATIONS = 3;

function FullscreenMonitor() {
  const location = useLocation();
  const navigate = useNavigate();

  const violationCount = useRef(
    Number(sessionStorage.getItem("fullscreenViolations") || 0)
  );

  const [warning, setWarning] = useState("");

  const shouldMonitor = !EXCLUDED_PAGES.includes(location.pathname);

  useEffect(() => {
    if (!shouldMonitor) {
      return;
    }

    const handleFullscreenChange = () => {
      // User is still in fullscreen
      if (document.fullscreenElement) {
        return;
      }

      violationCount.current += 1;

      sessionStorage.setItem(
        "fullscreenViolations",
        String(violationCount.current)
      );

      if (violationCount.current >= MAX_VIOLATIONS) {
        sessionStorage.removeItem("fullscreenViolations");

        logout();

        alert(
          "Fullscreen violation limit reached. You have been logged out."
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setWarning(
        `Fullscreen exited. Warning ${violationCount.current} of ${MAX_VIOLATIONS}.`
      );
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

  // Automatically hide the warning after a few seconds
  useEffect(() => {
    if (!warning) {
      return;
    }

    const timer = setTimeout(() => {
      setWarning("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [warning]);

  if (!shouldMonitor || !warning) {
    return null;
  }

  return (
    <div className="fullscreen-warning">
      <div className="fullscreen-warning-card">
        <div className="fullscreen-warning-icon">!</div>

        <div>
          <h3>Fullscreen Required</h3>

          <p>{warning}</p>

          <button
            type="button"
            onClick={() => {
              document.documentElement
                .requestFullscreen()
                .catch(() => {});
            }}
          >
            Return to Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}

export default FullscreenMonitor;