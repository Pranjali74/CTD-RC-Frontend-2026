import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Play, Send, ArrowLeft, CheckCircle } from "lucide-react";

import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";

import "./CodeEditor.css";

function CodeEditor() {
  const navigate = useNavigate();
  const location = useLocation();

  const questionId = location.state?.questionId || 1;

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [showTestCases, setShowTestCases] = useState(true);
  const [testsPassed, setTestsPassed] = useState(false);

  const languages = ["Python", "Java", "C++"];

  const handleRun = () => {
    // Temporary UI behaviour
    setTestsPassed(true);
    setShowTestCases(true);
  };

  const handleSubmit = () => {
    // Temporary navigation
    navigate("/submissions");
  };

  const handleBack = () => {
    navigate("/question-hub");
  };

  return (
    <PageBackground className="code-page">

      <Navbar />

      <main className="code-main">

        {/* BACK */}
        <button
          className="back-question"
          onClick={handleBack}
        >
          <ArrowLeft size={15} />
          Back to Questions
        </button>


        {/* MAIN EDITOR LAYOUT */}
        <div className="editor-layout">

          {/* =====================================
              LEFT - QUESTION
          ===================================== */}
          <section className="problem-panel">

            <div className="problem-header">

              <div className="problem-title-row">
                <h1>
                  1. Two Sum
                </h1>

                <span className="points-badge">
                  100 pts
                </span>
              </div>

            </div>


            {/* DESCRIPTION */}
            <div className="problem-description">

              <p>
                Given an array of integers and a target sum,
                return the indices of the two numbers such that
                they add up to the target.
              </p>

              <p>
                You may assume that each input would have exactly
                one solution, and you may not use the same element
                twice.
              </p>

            </div>


            {/* INPUT */}
            <div className="io-box">

              <div className="io-header">
                <span>Input</span>

                <button
                  className="run-input-button"
                  onClick={handleRun}
                >
                  <Play size={11} fill="currentColor" />
                  Run
                </button>
              </div>

              <div className="io-content">
                Enter your input here...
              </div>

            </div>


            {/* OUTPUT */}
            <div className="io-box output-box">

              <div className="io-header">
                <span>Output</span>
              </div>

              <div className="io-content">
                {testsPassed
                  ? "Output will be displayed here..."
                  : "Output will be displayed here..."
                }
              </div>

            </div>

          </section>


          {/* =====================================
              RIGHT - CODE EDITOR
          ===================================== */}
          <section className="editor-panel">

            {/* LANGUAGE TABS */}
            <div className="language-tabs">

              {languages.map((lang) => (
                <button
                  key={lang}
                  className={
                    language === lang
                      ? "language-tab active"
                      : "language-tab"
                  }
                  onClick={() => setLanguage(lang)}
                >
                  {lang}
                </button>
              ))}

            </div>


            {/* CODE AREA */}
            <div className="editor-container">

              <div className="line-numbers">
                {code.split("\n").map((_, index) => (
                  <span key={index}>
                    {index + 1}
                  </span>
                ))}
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                placeholder={
                  language === "Python"
                    ? "def twoSum(nums, target):"
                    : `Write your ${language} code here...`
                }
                className="code-textarea"
              />

            </div>


            {/* TEST CASE STATUS */}
            {showTestCases && (
              <div className="test-status">

                {testsPassed && (
                  <CheckCircle
                    size={17}
                    strokeWidth={2.2}
                  />
                )}

                <span>
                  {testsPassed
                    ? "4 / 5 test cases passed"
                    : "Run your code to test your solution"
                  }
                </span>

              </div>
            )}


            {/* BOTTOM ACTIONS */}
            <div className="editor-actions">

              <button
                className="run-code-button"
                onClick={handleRun}
              >
                <Play size={14} fill="currentColor" />
                Run Code
              </button>

              <button
                className="submit-code-button"
                onClick={handleSubmit}
              >
                <Send size={14} />
                Submit
              </button>

            </div>

          </section>

        </div>

      </main>

    </PageBackground>
  );
}

export default CodeEditor;