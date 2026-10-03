import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import Timer from "../components/Timer";


/* =========================================================
   PROGRESS CIRCLE
========================================================= */

function ProgressCircle({
  label,
  progress,
  solved,
}) {
  const radius = 35;
  const circumference =
    2 * Math.PI * radius;

  const safeProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  const offset =
    circumference -
    (safeProgress / 100) *
      circumference;

  return (
    <div className="qh-progress-wrapper">

      <svg
        className="qh-progress"
        width="82"
        height="82"
        viewBox="0 0 82 82"
      >

        <circle
          className="qh-progress-track"
          cx="41"
          cy="41"
          r={radius}
        />

        <circle
          className="qh-progress-value"
          cx="41"
          cy="41"
          r={radius}
          strokeDasharray={
            circumference
          }
          strokeDashoffset={offset}
        />

      </svg>

      <span className="qh-progress-label">
        {label}
      </span>

      {solved && (
        <span className="qh-check">
          ✓
        </span>
      )}

    </div>
  );
}


/* =========================================================
   QUESTION HUB
========================================================= */

export default function QuestionHub() {
  const navigate = useNavigate();

  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =======================================================
     FETCH QUESTIONS
  ======================================================= */

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await api.get(
            "/problems/accuracy"
          );

        const data =
          Array.isArray(response.data)
            ? response.data
            : response.data?.data ||
              response.data?.problems ||
              [];

        setQuestions(data);
      } catch (err) {
        console.error(
          "Failed to fetch questions:",
          err
        );

        /*
         * Contest/event is not currently
         * accessible.
         */

        if (
          err?.response?.status === 403
        ) {
          setError(
            err?.response?.data?.message ||
              err?.response?.data?.error ||
              "Access denied. The event is not currently active."
          );

          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Unable to load questions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);


  /* =======================================================
     SOLVE QUESTION
  ======================================================= */

  const handleSolve = (problemId) => {
    if (!problemId) {
      return;
    }

    navigate("/code-editor", {
      state: {
        problem_id: problemId,
        questionId: problemId,
      },
    });
  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="question-hub-page">

      {/* =========================
          TOP NAVIGATION
      ========================== */}

      <Navbar />

      <Timer />


      {/* =========================
          PAGE CONTENT
      ========================== */}

      <section className="question-hub-content">

        {/* =========================
            HEADING
        ========================== */}

        <div className="question-hub-heading">

          <div
            className="qh-heading-icon"
            aria-hidden="true"
          >
            ♜
          </div>

          <div>

            <h1>
              QUESTION HUB
            </h1>

            <p>
              Choose a question to start coding
            </p>

          </div>

        </div>


        {/* =========================
            QUESTION CARDS
        ========================== */}

        <div className="question-grid">

          {/* LOADING */}

          {loading && (
            <p>
              Loading questions...
            </p>
          )}


          {/* ERROR */}

          {!loading && error && (
            <p>
              {error}
            </p>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            questions.length === 0 && (
              <p>
                No questions are available
                right now.
              </p>
            )}


          {/* QUESTIONS */}

          {!loading &&
            !error &&
            questions.length > 0 &&
            questions.map(
              (item, index) => {

                const problemId =
                  item.problem_id ??
                  item.id;

                const parsedAccuracy =
                  Number.parseFloat(
                    String(
                      item.accuracy ?? "0"
                    ).replace("%", "")
                  );

                const accuracy =
                  Number.isFinite(
                    parsedAccuracy
                  )
                    ? Math.min(
                        100,
                        Math.max(
                          0,
                          parsedAccuracy
                        )
                      )
                    : 0;

                const solved =
                  localStorage.getItem(
                    `solved_${problemId}`
                  ) === "solved";


                return (
                  <article
                    className="question-card"
                    key={problemId}
                  >

                    <ProgressCircle
                      label={`Q${
                        index + 1
                      }`}
                      progress={
                        accuracy
                      }
                      solved={
                        solved
                      }
                    />


                    <button
                      type="button"
                      className="solve-btn"
                      onClick={() =>
                        handleSolve(
                          problemId
                        )
                      }
                    >
                      Solve
                    </button>

                  </article>
                );
              }
            )}

        </div>

      </section>

    </main>
  );
}