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
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get("/result/")
      .then((response) => {
        if (active) setResult(response.data);
      })
      .catch(() => {
        if (active) setError("Unable to load your results.");
      });

    return () => {
      active = false;
    };
  }, []);

  const accuracy = Number(result?.accuracy) || 0;
  const resultData = {
    rank: result?.rank ?? "-",
    score: result?.total_score ?? "-",
    totalSubmissions: result?.total_submissions ?? result?.totalSubmissions ?? "-",
    accuracy,
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <PageBackground className ="results-page">
      
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= RESULTS ================= */}
      <main className="results-container">

        {/* HEADER */}

        <div className="results-title">

          <div className="results-title-icon">
            <Trophy size={30} strokeWidth={2} />
          </div>

          <div className="results-title-text">
            <h1>RESULT</h1>

            <p>
              Here's how you performed in the event
            </p>
            {error && <p role="alert">{error}</p>}
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
                {resultData.accuracy}%
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