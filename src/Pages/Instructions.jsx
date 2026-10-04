import { useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../components/Navbar";

const instructions = [
  "There will be 4 problems in total. Each problem will carry equal score.",
  "Time duration: 60 minutes.",
  "There will be no penalty for wrong submissions.",
  "Use of AI tools, external help, or any form of cheating is strictly prohibited. All codes will be checked for plagiarism — violators will be disqualified.",
  "Exiting the full screen or switching tabs 3 times will log out the user automatically.",
];

export default function Instructions() {
  const navigate = useNavigate();

const handleProceed = async () => {
  try {
    await document.documentElement.requestFullscreen();
  } catch (error) {
    console.error("Unable to enter fullscreen:", error);
  }

  // Reset fullscreen violation count when contest starts
  sessionStorage.setItem("fullscreenViolations", "0");

  navigate("/question-hub");
};

  return (
    <main className="event-page">

      {/* =========================
          NAVBAR
      ========================== */}

      <Navbar />


      {/* =========================
          CONTENT
      ========================== */}

      <section className="content instructions-content">

        {/* HEADING */}

        <div className="page-heading">
          <h1>INSTRUCTIONS</h1>
          <span />
        </div>


        {/* INSTRUCTIONS */}

        <div className="instruction-list">

          {instructions.map((item, index) => (
            <article
              className="instruction-row"
              key={item}
            >

              <div className="instruction-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <p>
                {item}
              </p>

              <div
                className="instruction-icon"
                aria-hidden="true"
              >
                {
                  ["♧", "◷", "▤", "⚠", "↗"][index]
                }
              </div>

            </article>
          ))}

        </div>


        {/* PROCEED */}

        <button
          className="primary-btn proceed-btn"
          type="button"
          onClick={handleProceed}
        >
          PROCEED <span>→</span>
        </button>

      </section>

    </main>
  );
}