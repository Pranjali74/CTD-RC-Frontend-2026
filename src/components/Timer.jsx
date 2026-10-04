import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Timer() {
  const navigate = useNavigate();

  const [remainingMs, setRemainingMs] =
    useState(null);

  const [timeLoaded, setTimeLoaded] =
    useState(false);


  /* =========================================================
     GET EVENT TIME FROM BACKEND
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchTime = async () => {
      try {
        const response =
          await api.get("/time");

        if (!mounted) {
          return;
        }

        const backendTime =
          Number(
            response.data?.remainingMs
          );

        if (
          Number.isFinite(backendTime)
        ) {
          setRemainingMs(
            Math.max(0, backendTime)
          );
        } else {
          console.error(
            "Invalid remainingMs received from backend:",
            response.data
          );
        }

      } catch (error) {
        console.error(
          "Failed to fetch event time:",
          error
        );
      } finally {
        if (mounted) {
          setTimeLoaded(true);
        }
      }
    };

    fetchTime();

    return () => {
      mounted = false;
    };
  }, []);


  /* =========================================================
     COUNTDOWN
  ========================================================= */

  useEffect(() => {
    if (
      remainingMs === null ||
      remainingMs <= 0
    ) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingMs((previous) => {
        if (
          previous === null ||
          previous <= 1000
        ) {
          return 0;
        }

        return previous - 1000;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [remainingMs]);


  /* =========================================================
     REDIRECT WHEN EVENT ENDS
  ========================================================= */

  useEffect(() => {
    if (
      timeLoaded &&
      remainingMs !== null &&
      remainingMs <= 0
    ) {
      navigate("/results", {
        replace: true,
      });
    }
  }, [
    remainingMs,
    timeLoaded,
    navigate,
  ]);


  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (milliseconds) => {
    if (
      milliseconds === null ||
      milliseconds <= 0
    ) {
      return "00:00:00";
    }

    const totalSeconds =
      Math.floor(
        milliseconds / 1000
      );

    const hours =
      Math.floor(
        totalSeconds / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(
      2,
      "0" 
    )}`;
  };


  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="event-timer-container">
    <div className="event-timer">
      <span>
        {remainingMs === null
          ? "--:--:--"
          : formatTime(
              remainingMs
            )}
      </span>
    </div>
    </div>
  );
}

export default Timer;