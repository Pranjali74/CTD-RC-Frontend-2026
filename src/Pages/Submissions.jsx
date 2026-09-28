import { useNavigate } from "react-router-dom";
import {
  Check,
  FileText,
  Trophy,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";

import "./Submissions.css";

function Submissions() {
  const navigate = useNavigate();

  return (
    <div className="submissions-page">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ===================================================== */}
      <div className="submission-bg submission-bg-top"></div>
      <div className="submission-bg submission-bg-right"></div>
      <div className="submission-bg submission-bg-bottom"></div>

      <div className="submission-dots submission-dots-left">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <div className="submission-dots submission-dots-right">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

        <Navbar />
      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="submission-main">

        {/* Success Icon */}

        <div className="submission-success-icon">
          <Check size={58} strokeWidth={2.8} />
        </div>


        {/* Heading */}

        <div className="submission-heading">
          <h1>Solution Submitted!</h1>

          <p>
            Your solution has been successfully submitted.
          </p>
        </div>


        {/* =================================================
            SUBMISSION CARD
        ================================================= */}

        <div className="submission-card">

          <div className="submission-card-left">

            <div className="submission-question-icon">
              <FileText size={25} strokeWidth={2} />
            </div>

            <div className="submission-question-info">

              <h2>Question 1</h2>

              <p>Two Sum</p>

            </div>

          </div>


          <div className="submission-card-right">

            <div className="submission-score">
              100 / 100
            </div>

            <div className="submission-status">
              <Check size={18} strokeWidth={3} />
              Accepted
            </div>

          </div>

        </div>


        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="submission-actions">

          <button
            className="next-question-btn"
            onClick={() => navigate("/question-hub")}
          >
            <Trophy size={21} strokeWidth={2} />

            <span>
              View Next Question
            </span>

            <ArrowRight size={22} strokeWidth={2} />
          </button>


          <button
            className="view-submissions-btn"
            onClick={() => navigate("/submissions")}
          >
            <FileText size={21} strokeWidth={2} />

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