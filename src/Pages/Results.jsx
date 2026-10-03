import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Medal,
  Target,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";
import api from "../api/axios";

import "./Results.css";

function Results() {
  const navigate = useNavigate();

  /* =========================================================
     RESULT DATA
  ========================================================= */

  const [resultData, setResultData] = useState({
    rank: 0,
    score: 0,
    totalSubmissions: 0,
    accuracy: 0,
    teamname: "",
    isjunior: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH RESULTS
  ========================================================= */

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/result/");

        /*
         * Backend normally returns an array.
         * If it returns a single object, handle that too.
         */

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results ||
            response.data?.data ||
            [];

        if (!Array.isArray(data) || data.length === 0) {
          setResultData({
            rank: 0,
            score: 0,
            totalSubmissions: 0,
            accuracy: 0,
            teamname: "",
            isjunior: false,
          });

          return;
        }

        /*
         * Find the current user's result.
         *
         * The backend result endpoint can return
         * multiple team results, so use the stored
         * currentUser/teamname when available.
         */

        let currentResult = data[0];

        try {
          const storedUser =
            JSON.parse(
              localStorage.getItem("currentUser")
            );

          if (storedUser?.teamname) {
            const matchedResult = data.find(
              (item) =>
                String(item.teamname || "").toLowerCase() ===
                String(storedUser.teamname).toLowerCase()
            );

            if (matchedResult) {
              currentResult = matchedResult;
            }
          }
        } catch (storageError) {
          console.warn(
            "Unable to read current user:",
            storageError
          );
        }

        setResultData({
          rank:
            Number(currentResult.rank) || 0,

          score:
            Number(currentResult.total_score) || 0,

          totalSubmissions:
            Number(
              currentResult.total_submissions ??
                currentResult.totalSubmissions
            ) || 0,

          accuracy:
            Number(currentResult.accuracy) || 0,

          teamname:
            currentResult.teamname || "",

          isjunior:
            Boolean(currentResult.isjunior),
        });
      } catch (err) {
        console.error(
          "Error fetching results:",
          err
        );

        if (err?.response?.status === 403) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        setError(
          err?.response?.data?.message ||
            "Unable to load your results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  /* =========================================================
     LEADERBOARD
  ========================================================= */

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <PageBackground className="results-page">
        <Navbar />

        <main className="results-container">
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            Loading results...
          </div>
        </main>
      </PageBackground>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <PageBackground className="results-page">
        <Navbar />

        <main className="results-container">
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <p>{error}</p>

            <button
              className="leaderboard-btn"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>
        </main>
      </PageBackground>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <PageBackground className="results-page">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= RESULTS ================= */}

      <main className="results-container">

        {/* HEADER */}

        <div className="results-title">

          <div className="results-title-icon">
            <Trophy
              size={30}
              strokeWidth={2}
            />
          </div>

          <div className="results-title-text">

            <h1>
              RESULT
            </h1>

            <p>
              Here's how you performed in the event
            </p>

            {resultData.teamname && (
              <p>
                Team:{" "}
                <strong>
                  {resultData.teamname}
                </strong>
              </p>
            )}

          </div>

        </div>

        {/* ================= MAIN CONTENT ================= */}

        <div className="results-content">

          {/* LEFT SIDE - STAT CARDS */}

          <div className="results-left">

            <div className="results-cards">

              {/* RANK */}

              <div className="result-card">

                <div className="result-card-icon">
                  <Medal size={16} />
                </div>

                <div className="result-value">
                  {resultData.rank}
                </div>

                <div className="result-label">
                  Your Rank
                </div>

              </div>

              {/* SCORE */}

              <div className="result-card">

                <div className="result-card-icon">
                  <Target size={16} />
                </div>

                <div className="result-value">
                  {resultData.score}
                </div>

                <div className="result-label">
                  Total Score
                </div>

              </div>

              {/* TOTAL SUBMISSIONS */}

              <div className="result-card">

                <div className="result-card-icon">
                  <BarChart3 size={16} />
                </div>

                <div className="result-value">
                  {resultData.totalSubmissions}
                </div>

                <div className="result-label">
                  Total Submissions
                </div>

              </div>

              {/* ACCURACY */}

              <div className="result-card">

                <div className="result-card-icon">
                  <BarChart3 size={16} />
                </div>

                <div className="result-value">
                  {resultData.accuracy.toFixed(2)}%
                </div>

                <div className="result-label">
                  Accuracy
                </div>

              </div>

            </div>

            {/* VIEW LEADERBOARD */}

            <button
              className="leaderboard-btn"
              onClick={handleLeaderboard}
            >

              <BarChart3 size={15} />

              <span>
                View Leaderboard
              </span>

              <ArrowRight size={16} />

            </button>

          </div>

          {/* ================= ACCURACY ================= */}

          <div className="accuracy-box">

            <div
              className="accuracy-ring"
              style={{
                "--accuracy": `${resultData.accuracy}%`,
              }}
            >

              <div className="accuracy-value">
                {resultData.accuracy.toFixed(2)}%
              </div>

            </div>

            <div className="accuracy-label">
              Accuracy
            </div>

          </div>

        </div>

      </main>

    </PageBackground>
  );
}

export default Results;