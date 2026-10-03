import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  FileText,
  Trophy,
  ArrowRight,
  XCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../api/axios";

import "./Submissions.css";

function Submissions() {
  const navigate = useNavigate();

  const [submission, setSubmission] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     FETCH SUBMISSION HISTORY
  ===================================================== */

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await api.get(
            "/user/gethistory"
          );

        const data =
          Array.isArray(response.data)
            ? response.data
            : response.data?.data ||
              response.data?.submissions ||
              [];

        if (data.length === 0) {
          setSubmission(null);
          return;
        }

        /*
         * Sort newest submission first.
         *
         * Different backend versions may use
         * created_at or submitted_at.
         */

        const sortedData = [...data].sort(
          (a, b) => {
            const dateA = new Date(
              a.created_at ||
                a.submitted_at ||
                0
            ).getTime();

            const dateB = new Date(
              b.created_at ||
                b.submitted_at ||
                0
            ).getTime();

            return dateB - dateA;
          }
        );

        setSubmission(
          sortedData[0]
        );
      } catch (err) {
        console.error(
          "Error fetching submissions:",
          err
        );

        if (
          err?.response?.status === 403
        ) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        setError(
          err?.response?.data?.message ||
            "Unable to load submission."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [navigate]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getStatus = () => {
    if (!submission) {
      return "Pending";
    }

    return (
      submission.status ||
      submission.result ||
      "Pending"
    );
  };

  const status = getStatus();

  const isAccepted =
    String(status).toLowerCase() ===
    "accepted";

  const problemId =
    submission?.problem_id ??
    submission?.problemId ??
    "-";

  const questionNumber =
    problemId !== "-"
      ? `Question ${problemId}`
      : "Question";

  const questionTitle =
    submission?.problem_title ||
    submission?.title ||
    `Question ${problemId}`;

  const score =
    submission?.score ??
    submission?.total_score ??
    0;

  const totalScore =
    submission?.max_score ??
    submission?.total_points ??
    submission?.points ??
    100;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="submissions-page">

        <div className="submission-bg submission-bg-top"></div>
        <div className="submission-bg submission-bg-right"></div>
        <div className="submission-bg submission-bg-bottom"></div>

        <Navbar />

        <main className="submission-main">
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            Loading submission...
          </div>
        </main>

      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="submissions-page">

        <div className="submission-bg submission-bg-top"></div>
        <div className="submission-bg submission-bg-right"></div>
        <div className="submission-bg submission-bg-bottom"></div>

        <Navbar />

        <main className="submission-main">

          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <p>{error}</p>

            <button
              className="view-submissions-btn"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>
          </div>

        </main>

      </div>
    );
  }

  /* =====================================================
     NO SUBMISSIONS
  ===================================================== */

  if (!submission) {
    return (
      <div className="submissions-page">

        <div className="submission-bg submission-bg-top"></div>
        <div className="submission-bg submission-bg-right"></div>
        <div className="submission-bg submission-bg-bottom"></div>

        <div className="submission-dots submission-dots-left">
          {Array.from({
            length: 25,
          }).map((_, i) => (
            <span key={i}></span>
          ))}
        </div>

        <div className="submission-dots submission-dots-right">
          {Array.from({
            length: 25,
          }).map((_, i) => (
            <span key={i}></span>
          ))}
        </div>

        <Navbar />

        <main className="submission-main">

          <div className="submission-success-icon">
            <FileText
              size={58}
              strokeWidth={2.8}
            />
          </div>

          <div className="submission-heading">

            <h1>
              No Submissions Yet
            </h1>

            <p>
              Submit a solution to see your
              submission details here.
            </p>

          </div>

          <div className="submission-actions">

            <button
              className="next-question-btn"
              onClick={() =>
                navigate(
                  "/question-hub"
                )
              }
            >
              <Trophy
                size={21}
                strokeWidth={2}
              />

              <span>
                Go to Questions
              </span>

              <ArrowRight
                size={22}
                strokeWidth={2}
              />
            </button>

          </div>

        </main>

      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="submissions-page">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}

      <div className="submission-bg submission-bg-top"></div>

      <div className="submission-bg submission-bg-right"></div>

      <div className="submission-bg submission-bg-bottom"></div>

      <div className="submission-dots submission-dots-left">
        {Array.from({
          length: 25,
        }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <div className="submission-dots submission-dots-right">
        {Array.from({
          length: 25,
        }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <Navbar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="submission-main">

        {/* Success / Status Icon */}

        <div className="submission-success-icon">

          {isAccepted ? (
            <Check
              size={58}
              strokeWidth={2.8}
            />
          ) : (
            <XCircle
              size={58}
              strokeWidth={2.8}
            />
          )}

        </div>

        {/* Heading */}

        <div className="submission-heading">

          <h1>
            {isAccepted
              ? "Solution Submitted!"
              : "Submission Result"}
          </h1>

          <p>
            {isAccepted
              ? "Your solution has been successfully submitted."
              : "Here is the result of your latest submission."}
          </p>

        </div>

        {/* =================================================
            SUBMISSION CARD
        ================================================= */}

        <div className="submission-card">

          <div className="submission-card-left">

            <div className="submission-question-icon">
              <FileText
                size={25}
                strokeWidth={2}
              />
            </div>

            <div className="submission-question-info">

              <h2>
                {questionNumber}
              </h2>

              <p>
                {questionTitle}
              </p>

            </div>

          </div>

          <div className="submission-card-right">

            <div className="submission-score">
              {score} / {totalScore}
            </div>

            <div
              className={`submission-status ${
                isAccepted
                  ? ""
                  : "submission-status-failed"
              }`}
            >

              {isAccepted ? (
                <Check
                  size={18}
                  strokeWidth={3}
                />
              ) : (
                <XCircle
                  size={18}
                  strokeWidth={3}
                />
              )}

              {status}

            </div>

          </div>

        </div>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="submission-actions">

          <button
            className="next-question-btn"
            onClick={() =>
              navigate(
                "/question-hub"
              )
            }
          >

            <Trophy
              size={21}
              strokeWidth={2}
            />

            <span>
              View Next Question
            </span>

            <ArrowRight
              size={22}
              strokeWidth={2}
            />

          </button>

          <button
            className="view-submissions-btn"
            onClick={() =>
              navigate(
                "/submissions"
              )
            }
          >

            <FileText
              size={21}
              strokeWidth={2}
            />

            <span>
              View Submissions
            </span>

          </button>

        </div>

      </main>

    </div>
  );
}

export default Submissions;