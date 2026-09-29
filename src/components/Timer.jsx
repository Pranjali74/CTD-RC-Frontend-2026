import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Timer = () => {
  const navigate = useNavigate();
  const [remainingMs, setRemainingMs] = useState(null);

  useEffect(() => {
    let active = true;

    api.get("/time")
      .then((response) => {
        if (active) setRemainingMs(response.data.remainingMs);
      })
      .catch(() => {
        if (active) setRemainingMs(undefined);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (remainingMs === null || remainingMs === undefined) return undefined;
    if (remainingMs <= 0) {
      navigate("/results");
      return undefined;
    }

    const interval = setInterval(() => {
      setRemainingMs((current) => Math.max(0, current - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingMs, navigate]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  };

  return (
    <div className="event-timer">
      <span aria-live="polite">
        {remainingMs === null
          ? "Loading..."
          : remainingMs === undefined
            ? "Time unavailable"
            : formatTime(remainingMs)}
      </span>
    </div>
  );
};

export default Timer;